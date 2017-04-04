# library-opentimes
The Library opening times we know from stats is one of the the most popular pages on the website, second only to the search page. The opening times page is typically overly-wordy and takes time to decode, so providing this key information a the point of need seemed sensible. This code snippet can be repeated on any website anywhere any number of times, always referring back to the one golden source of data.

This is a JQuery code snippet that renders Library opening and staffing times pulled from a remote XML document on a CORs configured server.

To make the XML source document:

1. create a new Excel spreadsheet with a column for each entry: date, longdate, opening times, staffed, notes
 
Hint :- To save time, I use the box drag in Excel to make the correct dates in the two date columns. For the next 2 columns i tend to look for the most common opening times and hours and copy them using the dragging box trick to repeat the values, then replace exceptions by hand.
 
The notes column is only filled in in exceptional circumstances
 
 
2 Forget converting to XML using Excel, it appears to suck (and blow). Export the spreadsheet as CSV and go here instead:
 
http://www.convertcsv.com/csv-to-xml.htm
 
this free online converter takes the top row as field names and produces a great XML file in the right format, see the other file in this repository.
