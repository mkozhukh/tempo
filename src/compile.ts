import { Format, FormatStyle } from "./types";
import { parts } from "./parts";
import { deviceLocale } from "./deviceLocale";
import { ap } from "./ap";
import { minsToOffset } from "./common";

export function compile(format: Format, locale:string = "en", tz?:string): (v: Date) => string {
    locale = locale ?? deviceLocale();
    const formatParts = parts(format, locale);
    
    // Create a single formatter with all options
    const options: Intl.DateTimeFormatOptions = {};
    if (tz) {
        options.timeZone = tz;
    }
    
    // If format is a named format (like "long" or "short"), use the appropriate options
    if (typeof format === "string" && ["full", "long", "medium", "short"].includes(format as FormatStyle)) {
        options.dateStyle = format as FormatStyle;
    } else if (typeof format === "object") {
        if ("date" in format) options.dateStyle = format.date;
        if ("time" in format) options.timeStyle = format.time;
    } else {
        Object.assign(options, {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        // Only set individual options if we're not using named styles
        Object.assign(options, formatParts.reduce((acc, part) => {
            if (part.partName !== "literal") {
                acc[part.partName] = part.partValue;
                if (part.hour12) {
                    acc.hour12 = part.hour12;
                }
            }
            return acc;
        }, {} as Record<string, string | boolean>));
    }
    
    const formatter = new Intl.DateTimeFormat(locale, options);
    
    // Create an array of formatter functions for each part
    const formatters = formatParts.map(part => {
        if (part.partName === "literal") {
            return () => part.partValue;
        }
        
        if (part.partName === "dayPeriod") {
            return (date: Date, temp: Intl.DateTimeFormatPart[]) => {
                const isPM = date.getUTCHours() >= 12;
                const period = ap(isPM ? "pm" : "am", locale);
                return part.token === "A" ? period.toUpperCase() : period.toLowerCase();
            };
        }
        
        if (part.partName === "timeZoneName") {
            return (date: Date, temp: Intl.DateTimeFormatPart[]) => {
                return minsToOffset(-1 * date.getTimezoneOffset(), part.token);
            };
        }
        
        const f = (date: Date, temp: Intl.DateTimeFormatPart[]) => {
            return temp.find(p => p.type === part.partName)?.value || "";
        };

        if (["H", "m", "s"].includes(part.token)) {
            return (date: Date, temp: Intl.DateTimeFormatPart[]) => {
                const value = f(date, temp);
                return value.length === 2 && value[0] === "0" ? value.slice(1) : value;
            };
        }

        if (["mm", "ss", "MM"].includes(part.token)) {
            return (date: Date, temp: Intl.DateTimeFormatPart[]) => {
                const value = f(date, temp);
                return value.length === 1 ? `0${value}` : value;
            };
          }

        return f;
    });
    
    // Return a function that applies all formatters and joins the results
    return (date: Date) => {
        const temp = formatter.formatToParts(date);
        return formatters.map(f => f(date, temp)).join("");
    }
}