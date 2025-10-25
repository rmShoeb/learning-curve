# 03 - Date/Time API

## Introduction
- The `java.util.Date` and `java.util.Calendar` classes in Java are not thread safe. The new Date and Time APIs introduced in Java 8 are immutable and thread safe.
- The `java.util.Date` and `java.util.Calendar` APIs are poorly designed with inadequate methods to perform day-to-day operations. The new Date/Time API is ISO-centric and follows consistent domain models for date, time, duration and periods.
- Developers had to write additional logic to handle time-zone logic with the old APIs, whereas with the new APIs, handling of time zone can be done with Local and `ZonedDate`/`Time` APIs.
- The Date-Time API uses the calendar system defined in [ISO-8601](http://www.iso.org/iso/home/standards/iso8601.htm) as the default calendar.
- To use an alternative calendar system, such as Hijrah or Thai Buddhist, we have to use the `java.time.chrono` package.
- The Date-Time API uses the [Unicode Common Locale Data Repository (CLDR)](http://cldr.unicode.org/).
- The Date-Time API also uses the [Time-Zone Database (TZDB)](http://www.iana.org/time-zones).
- Most of the classes in the Date-Time API create objects that are immutable. This means that objects created from this API is thread-safe.

## `java.time`
- The main API for dates, times, instants, and durations.
- Introduced in the Java SE 8 release, provides a comprehensive model for date and time.
- Although this package is based on the International Organization for Standardization (ISO) calendar system, commonly used global calendars are also supported.
- Classes of this package are [value-based](https://docs.oracle.com/javase/8/docs/api/java/lang/doc-files/ValueBased.html). Use of identity-sensitive operations (including reference equality (`==`), identity hash code, or synchronization) on instances of `LocalDate` may have unpredictable results and should be avoided.
- The `equals` method should be used for comparisons.

### `LocalDate`
- This class represents a date in ISO-8601 calendar system without time (such as `yyyy-MM-dd`).
- This class does not store or represent a time or time-zone.
- It cannot represent an instant on the time-line without additional information such as an offset or time-zone.

```java
LocalDate localDate = LocalDate.now();
LocalDate.of(2015, 02, 20);
LocalDate.parse("2015-02-20");
LocalDate.now().plusDays(1);
LocalDate.now().minus(1, ChronoUnit.MONTHS);
DayOfWeek sunday = LocalDate.parse("2016-06-12").getDayOfWeek();
int twelve = LocalDate.parse("2016-06-12").getDayOfMonth();
boolean leapYear = LocalDate.now().isLeapYear();
boolean notBefore = LocalDate.parse("2016-06-12").isBefore(LocalDate.parse("2016-06-11"));
boolean isAfter = LocalDate.parse("2016-06-12").isAfter(LocalDate.parse("2016-06-11"));
LocalDateTime beginningOfDay = LocalDate.parse("2016-06-12").atStartOfDay();
```

### `LocalTime`
- This class represents A time without a time-zone in the ISO-8601 calendar system, such as `10:15:30`.
- Time is represented to nanosecond precision.
- This class does not store or represent a date or time-zone.
- Similar to `LocalDate`, we can create an instance of `LocalTime` from the system clock or by using parse and of methods.

```java
LocalTime now = LocalTime.now();
LocalTime sixThirty = LocalTime.parse("06:30");
LocalTime sixThirty = LocalTime.of(6, 30);
LocalTime sevenThirty = LocalTime.parse("06:30").plus(1, ChronoUnit.HOURS);
int six = LocalTime.parse("06:30").getHour();
boolean isbefore = LocalTime.parse("06:30").isBefore(LocalTime.parse("07:30"));
LocalTime maxTime = LocalTime.MAX;
```

### `LocalDateTime`
- This class is used to represent a combination of date and time.
- Represents a date-time without a time-zone in the ISO-8601 calendar system, such as `2007-12-03T10:15:30`.
- Time is represented to nanosecond precision.
- This class does not store or represent a time-zone.
- It cannot represent an instant on the time-line without additional information such as an offset or time-zone.
- Has the same methods as `LocalDate` and `LocalTime`.

### `Period` and `Duration`
- The `Period` class represents a quantity of time in terms of years, months and days.
- The `Duration` class represents a quantity of time in terms of seconds and nanoseconds.
- The duration uses nanosecond resolution with a maximum value of the seconds that can be held in a long. This is greater than the current estimated age of the universe.
- The class stores a long representing seconds and an int representing nanosecond-of-second.
- The duration is measured in "seconds", but these are not necessarily identical to the scientific "SI second" definition based on atomic clocks.
- Durations and periods differ in their treatment of daylight savings time when added to `ZonedDateTime`. A Duration will add an exact number of seconds, thus a duration of one day is always exactly 24 hours. By contrast, a `Period` will add a conceptual day, trying to maintain the local time.

```java
LocalDate initialDate = LocalDate.parse("2007-05-10");
LocalDate finalDate = initialDate.plus(Period.ofDays(5));
int five = Period.between(initialDate, finalDate).getDays();
LocalTime finalTime = initialTime.plus(Duration.ofSeconds(30));
long thirty = Duration.between(initialTime, finalTime).getSeconds();
```

### `DateTimeFormatter`
- Class is defined under `java.time.format` package.
- Formatter for printing and parsing date-time objects.
- More complex formatters are provided by `DateTimeFormatterBuilder`.
- The main date-time classes provide two methods:
	- one for formatting, format(DateTimeFormatter formatter)
	- one for parsing, parse(CharSequence text, DateTimeFormatter formatter)
- This class has multiple predefined formatters, like `ISO_LOCAL_TIME`, `RFC_1123_DATE_TIME`.

```java
String localDateString = localDateTime.format(DateTimeFormatter.ISO_DATE);
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy MM dd");
LocalDate parsedDate = LocalDate.parse(localDateString, formatter);
localDateTime.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
localDateTime
  .format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM)
  .withLocale(Locale.UK));
```

## Resources
- https://www.baeldung.com/java-8-date-time-intro
- https://docs.oracle.com/javase/tutorial/datetime/index.html