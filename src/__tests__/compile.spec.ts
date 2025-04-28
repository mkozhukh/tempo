import { describe, expect, it } from "vitest"
import { compile } from "../compile"
import { tzDate } from "../tzDate"
import { parse } from "../parse"
process.env.TZ = "America/New_York"

/**
 * YY - 2 digit year
 * YYYY - 4 digit year
 * M - The month 1-12
 * MM - The month 01-12
 * MMM - Short name Jan-Dec
 * MMMM - Full name January - December
 * D - The day of the month 1-31
 * DD - The day of the month 01-31
 * d - Single digit day "T"
 * ddd - Short day name Thu
 * dddd - Full day name Wednesday
 * H - Minimum hour digits, 24 hour, 0-23
 * HH - 2 hour digits, 24 hour, 00-23
 * h - Minimum hour digits, 12 hour clock, 1-12
 * hh - 2 hour digits, 12 hour clock, 01-12
 * m - The minute 0-12
 * mm - The minute 00-12
 * s - The second 0-59
 * ss - The second 00-59
 * a - am/pm
 */
describe("format", () => {
  it('renders "short" dates', () => {
    expect(compile("short")(parse("2017-05-06"))).toEqual("5/6/17")
  })
  it('renders "medium" dates', () => {
    expect(compile("medium")(parse("2017-07-06"))).toEqual("Jul 6, 2017")
  })
  it('renders "long" dates', () => {
    expect(compile("long")(parse("2017-07-06"))).toEqual("July 6, 2017")
  })
  it('renders "full" dates', () => {
    expect(compile("full")(parse("2017-07-06"))).toEqual("Thursday, July 6, 2017")
  })

  it("can render a single full year", () => {
    expect(compile("YYYY")(parse("2020-01-05"))).toEqual("2020")
  })
  it("can render a single 2 digit year", () => {
    expect(compile("YY")(parse("1999-05-06"))).toEqual("99")
  })
  it("can render a single digit month", () => {
    expect(compile("M")(parse("1999-05-06"))).toEqual("5")
  })
  it("can render a double digit month", () => {
    expect(compile("MM")(parse("1999-05-06"))).toEqual("05")
  })
  it("can render a short month name", () => {
    expect(compile("MMM")(parse("1999-12-06"))).toEqual("Dec")
  })
  it("can render a long month name", () => {
    expect(compile("MMMM")(parse("1999-01-06"))).toEqual("January")
  })
  it("can render a one digit date", () => {
    expect(compile("D")(parse("1999-01-06"))).toEqual("6")
  })
  it("can render a 2 digit date", () => {
    expect(compile("DD")(parse("1999-01-06"))).toEqual("06")
  })
  it("can render the day of the week as a single character", () => {
    expect(compile("d")(parse("2022-10-12"))).toEqual("W")
  })
  it("can render the day of the week as 3 characters", () => {
    expect(compile("ddd")(parse("2022-10-13"))).toEqual("Thu")
  })
  it("can render the full day of the week", () => {
    expect(compile("dddd")(parse("2022-10-10"))).toEqual("Monday")
  })
  it("can render the single digit 24 hour", () => {
    expect(compile("H")(parse("2022-10-10T05:15:00"))).toEqual("5")
  })
  it("can render the double digit 24 hour", () => {
    expect(compile("HH")(parse("2022-10-10T15:15:00"))).toEqual("15")
  })
  it("can render the single digit 12 hour", () => {
    expect(compile("h")(parse("2022-10-10T13:15:00"))).toEqual("1")
  })
  it("can render the 2 digit 12 hour", () => {
    expect(compile("hh")(parse("2022-10-10T05:15:00"))).toEqual("05")
  })
  it("can render the single digit minutes", () => {
    expect(compile("m")(parse("2022-10-10T05:05:00"))).toEqual("5")
  })
  it("can render the two digit minutes", () => {
    expect(compile("mm")(parse("2022-10-10T07:07:00"))).toEqual("07")
  })
  it("can render the single digit seconds", () => {
    expect(compile("s")(parse("2022-10-10T07:07:01"))).toEqual("1")
  })
  it("can render the double digit seconds", () => {
    expect(compile("ss")(parse("2022-10-10T07:07:10"))).toEqual("10")
  })
  it("can render the double digit seconds", () => {
    expect(compile("ss")(parse("2022-10-10T07:07:05"))).toEqual("05")
  })
  it("can render am", () => {
    expect(compile("a")(parse("2022-10-10T07:07:05"))).toEqual("am")
  })
  it("can render pm", () => {
    expect(compile("a")(parse("2022-10-10T17:07:05"))).toEqual("pm")
  })
  it("throws an error when two month format are used", () => {
    expect(() => compile("MM MMMM")(parse("2020-01-01"))).toThrow()
  })
  it("can format a standard US style date", () => {
    expect(compile("MM/DD/YYYY")(parse("1986-03-17T06:44:15"))).toBe("03/17/1986")
  })
  it("can render us time with am/pm", () => {
    expect(compile("h:mm:ss a")(parse("2020-03-15T05:30:10"))).toBe("5:30:10 am")
  })
  it("can render us time with AM/PM", () => {
    expect(compile("h:mm:ss A")(parse("2020-03-15T05:30:10"))).toBe("5:30:10 AM")
  })
  it("can render us time with am/pm in chinese", () => {
    expect(compile("h:mm:ss A", "zh")(parse("2020-03-15T05:30:10"))).toBe(
      "5:30:10 上午"
    )
    expect(compile("h:mm:ss A", "zh")(parse("2020-03-15T15:30:10"))).toBe(
      "3:30:10 下午"
    )
  })
  it("can render a long date and short time", () => {
    expect(compile({ date: "full", time: "short" })(parse("2100-05-03T04:04:01"))).toBe(
      "Monday, May 3, 2100 at 4:04 AM"
    )
  })
  it("can render a long date and short time in Japanese", () => {
    expect(
      compile({ date: "full", time: "short" }, "ja")(parse("2100-05-03T04:04:01"))
    ).toBe("2100年5月3日月曜日 4:04")
  })
  it("can render a long time in Japanese", () => {
    expect(compile({ time: "full" }, "ja")(parse("2010-06-09T04:32:00Z"))).toBe(
      "0時32分00秒 -04:00"
    )
  })
  it("can format the russian month of february", () => {
    expect(compile({ date: "medium" }, "ru")(parse("2023-03-14"))).toBe(
      "14 мар. 2023 г."
    )
  })
  it("can include the timezone of a date", () => {
    expect(compile("HH:mm:ss Z", "en")(parse("2023-05-05T05:30:10Z"))).toBe(
      "01:30:10 -04:00"
    )
    expect(compile("HH:mm:ss ZZ", "en")(parse("2023-05-05T05:30:10Z"))).toBe(
      "01:30:10 -0400"
    )
  })
  it("uses offsets in full date formatting", () => {
    expect(
      compile({ date: "full", time: "full" }, "en")(parse("2023-05-05T05:30:10Z"))
    ).toBe("Friday, May 5, 2023 at 1:30:10 AM -04:00")
  })
  it("can format with some escapes and characters", () => {
    expect(
      compile("C\\heckin: MMM D, YYYY", "en")(parse("2040-12-17T05:00:00.000Z"))
    ).toBe("Checkin: Dec 17, 2040")
  })
})

describe("format with a timezone", () => {
  it("can format a date with a timezone", () => {
    expect(
      compile("D HH:mm:ss", undefined, "Europe/Amsterdam")(parse("2023-05-07T05:30:10"))
    ).toBe("7 11:30:10")
  })

  it("can format a date with a timezone", () => {
    expect(
      compile("D HH:mm:ss", undefined, "Asia/Tokyo")(
        tzDate("2022-10-29T11:30:50", "America/Los_Angeles")
      )
    ).toBe("30 03:30:50")
  })

  // it("uses the proper offset when using tz with the Z token (#14)", () => {
  //   expect(
  //     compile("Z", undefined, "Asia/Kolkata")(parse("2022-10-29T11:30:50Z"))
  //   ).toBe("+05:30")
  //   expect(
  //     compile("ZZ", undefined, "Asia/Kolkata")(parse("2022-10-29T11:30:50Z"))
  //   ).toBe("+0530")
  //   expect(
  //     compile("D hh:mm a Z", undefined, "America/New_York")(parse("2023-02-20T10:15:00"))
  //   ).toBe("20 10:15 am -05:00")
  //   expect(
  //     compile("D hh:mm a ZZ", undefined, "America/New_York")(parse("2023-02-20T10:15:00"))
  //   ).toBe("20 10:15 am -0500")
  //   expect(
  //     compile("YYYY-MM-DDTHH:mm:ssZ", undefined, "Europe/Stockholm")(
  //       parse("2024-02-16T11:00:00Z")
  //     )
  //   ).toBe("2024-02-16T12:00:00+01:00")
  //   expect(
  //     compile("YYYY-MM-DDTHH:mm:ssZZ", undefined, "Europe/Stockholm")(
  //       parse("2024-02-16T11:00:00Z")
  //     )
  //   ).toBe("2024-02-16T12:00:00+0100")
  // })

  // it("can format times during device DST gaps", () => {
  //   expect(
  //     compile("HH:mm:ssZ", undefined, "UTC")(parse("2024-03-10T02:30:00Z"))
  //   ).toBe("02:30:00+00:00")
  //   expect(
  //     compile("HH:mm:ssZZ", undefined, "UTC")(parse("2024-03-10T02:30:00Z", "UTC"))
  //   ).toBe("02:30:00+0000")
  // })
  it("can render a double character zero with leading zeros in zh (#41)", () => {
    expect(compile("YYYY-MM", "zh")(parse("2022-04-10"))).toBe("2022-04")
  })
  // it('can render "long" time format as the ZZ token', () => {
  //   expect(
  //     compile({ date: "short", time: "long" }, "en", "America/Chicago")(
  //       parse("1989-12-19T07:30:10.000Z")
  //     )
  //   ).toBe("12/19/89, 1:30:10 AM -0600")
  // })
})
