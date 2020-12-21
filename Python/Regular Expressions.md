Regular Expressions
========================
Use special characters to match strings more specifically.

## Special Characters

| Symbol | Meaning |
| ------------- |---------------|
| **^** | Matches the beginning of a line |
| **$** | Matches the end of the line |
| **.** | Matches any character |
| **\s** | Matches whitespace |
| **\S** | Matches any non-whitespace character |
| **\*** | Repeats a character zero or more times |
| **\*?** | Repeats a character zero or more times (non-greedy) |
| **+** | Repeats a character one or more times |
| **+?** | Repeats a character one or more times (non-greedy) |
| **[somesymbols]** | Matches a single character in the listed set |
| **[^somesymbols]** | Matches a single character not in the listed set |
| **[a-z0-9]** | The set of characters can include a range |
| **\(** | Indicates where string extraction to start |
| **\)** | Indicates where string extraction to end |
| **\\** | Escape character, to print other special characters |

### Some Examples
* `'From: '`-> matches anywhere in string where there is *From, a single colon and a single space*
* `'^From: '`-> mathces strings starting with *From, a single colon and a single space*
* `'^X.*:'`-> matches string starting with *X, then any symbol any number of times and then a colon*,   
**i.e.  
"X-Sieve: CMU Sieve 2.3",  
"X-DSPAM-Result: Innocent"  
"X-DSPAM-Confidence: 0.8475"**
* `'^X-\S+:'`-> matches strings starting with *X-, any non-blank character one or more times, and then a colon*  
**i.e.  
"X-Sieve: CMU Sieve 2.3",  
"X-DSPAM-Result: Innocent"  
but not "X-Plan is behind schedule: two weeks", although the previous expression will consider this as a match.**
* `'[0-9]+'`-> any character within 0-9 at least once.
* 

## Importing module
```
import re
```
### Important Methods
* `re.search(regular_expression, input_string)`  
Returns `True` if there is at least one match in the string, `False` otherwise.  
```
string = "From: jesse.pinkman@meth.com"  
re.search('^From: ', string)
```  
This portion of code will yield `True`.
* `re.findall(regular_expression, input_string)`  
Returns a list of all matches. If there is no match found, an empty list is returned.  
```
string = "My 2 favorite numbers are 19 and 42."  
re.findall('[0-9]+', string)
```  
This portion of code returns `['2', '19', '42']`.

### Greedy Matching
If variable length portion from same position matchs the expression, the library tends to select the lengthy one. This is *Greedy Matching*. **i.e.**  
```
string = "From: Using the: character"  
re.findall('^F.+:', string)
```  
This portion of code returns `['From: Using the:']`, although `['From:']` also matches the expression.  
To avoid greedy matching, we use `?` to get the shortest match. Hence `re.findall('^F.+?:', string)` will return `['From:']`.

### Fine Tuning String Extraction
The idea is to mtach some part of string but extract only a portion of the matching string.  
```
string = "From stephen.marquard@uct.ac.us Sat Jan"  
re.findall('^From (\S+@\S+)', string)
```  
will return `['stephen.marquard@uct.ac.us']`.  
The method tries to find mathces with the expression, but extracts only the portion within the paranthesis.


