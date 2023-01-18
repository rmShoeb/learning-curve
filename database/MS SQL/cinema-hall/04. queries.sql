-- 1.	Write a query to find all distinct movies released per cinema.
SELECT
    cnms.name Cinema,
	mvs.title Movie
FROM cinema_schema.cinemas cnms
INNER JOIN cinema_schema.halls hls
    ON cnms.id = hls.cinema
INNER JOIN cinema_schema.show_schedules scdls
	ON hls.id = scdls.hall
INNER JOIN cinema_schema.shows sws
	ON scdls.id = sws.schedule
INNER JOIN info_schema.movies mvs
	ON sws.movie = mvs.id
GROUP BY
	cnms.name,
	mvs.title
ORDER BY
	cnms.name,
	mvs.title
;

-- 2.	Write a query to find the number of movies released this year/this month per cinema.
SELECT
    cnms.name Cinema,
	COUNT(mvs.title) 'Movie Count'
FROM cinema_schema.cinemas cnms
INNER JOIN cinema_schema.halls hls
    ON cnms.id = hls.cinema
INNER JOIN cinema_schema.show_schedules scdls
	ON hls.id = scdls.hall
INNER JOIN cinema_schema.shows sws
	ON scdls.id = sws.schedule
INNER JOIN info_schema.movies mvs
	ON sws.movie = mvs.id
WHERE
	mvs.released_year = YEAR(GETDATE())
GROUP BY
	cnms.name
ORDER BY
	cnms.name
;



-- 3.	Write a query to find those schedules for all halls which did not show any movies.
--      a.	Let’s assume there are schedules like that, so insert the data as such.
SELECT
	scdls.hall 'Hall',
	scdls.schedule 'Show Time'
FROM cinema_schema.show_schedules scdls
FULL OUTER JOIN cinema_schema.shows sws
	ON scdls.id = sws.schedule
WHERE
	sws.day IS NULL
;
