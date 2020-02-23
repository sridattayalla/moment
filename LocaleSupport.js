let localeSupport = {
    'formatRegex' : {
        // 'ww': '(\\d{2})',
        // 'w': '(\\d{1,2})',
        'dddd': '(\\w+)',
        'ddd': '(\\w{3})',
        'A':'(\\w{2})',
        'a': '(\\w{2})',
        'YYYY' : '(\\d{4})',
        'YY' : '(\\d{2})',
        'Y': '(\\d+)',
        'Q': '([1-4])',
        'MMMM': '(\\w+)',
        'MMM' : '(\\w{3})',
        'MM' : '(0[1-9]|[1-2][0-9]|3[0-1])',
        'M' : '([1-9]|[1-2][0-9]|3[0-1])',
        'DDDD' : '(\\d{3})',
        'DDD': '(\\d{1,3})',
        'DD': '(\\d{2})',
        'Do': '(\\d{1,2}[a-z]{2})',
        'D': '(\\d{1,2})',
        'X': '(\\d{10}.d{3})',
        'x': '(\\d{13})',
        // 'gggg': '(\\d{4})',
        // 'gg': '(\\d{2})',
        'e': '([0-6])',
        'GGGG': '(\\d{4})',
        'GG': '(\\d{2})',
        'WW': '(\\d{2})',
        'W': '(\\d{1,2})',
        'E': '([1-7])',
        'HH': '(\\d{2})',
        'H': '(\\d+)',
        'hh': '(\\d{2})',
        'h': '(\\d+)',
        'kk': '(\\d{2})',
        'k': '(\\d+)',
        'mm': '(\\d{2})',
        'm': '(\\d{1,2})',
        'SSS': '(\\d{1,3})',
        'ss': '(\\d{2})',
        's': '(\\d+)',
    },
    'validationRegex' : {
        'ww': '(0[1-9]|[1-4][0-9]|5[0-3])',
        'w': '([1-9]|[1-4][0-9]|5[0-3])',
        'dddd': '(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)',
        'ddd': '(Mon|Tue|Wed|Thu|Fri|Sat|Sun)',
        'A':'(AM|PM)',
        'a': '(am|pm)',
        'YYYY' : '(\\d{4})',
        'YY' : '(\\d{2})',
        'Y': '(\\d+)',
        'Q': '([1-4])',
        'MMMM': '(January|Febraury|March|April|May|June|July|August|September|October|November|December)',
        'MMM' : '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)',
        'MM' : '(0[1-9]|[1-2][0-9]|3[0-1])',
        'M' : '([1-9]|[1-2][0-9]|3[0-1])',
        'DDDD' : '(\\d{3})',
        'DDD': '(\\d{1,3})',
        'DD': '(\\d{2})',
        'Do': '(\\d{1,2}[a-z]{2})',
        'D': '(\\d{1})',
        'X': '(\\d{10}.d{3})',
        'x': '(\\d{13})',
        // 'gggg': '(\\d{4})',
        // 'gg': '(\\d{2})',
        'e': '([0-6])',
        'GGGG': '(\\d{4})',
        'GG': '(\\d{2})',
        'WW': '(\\d{2})',
        'W': '(\\d{1,2})',
        'E': '([1-7])',
        'HH': '(0[0-9]|1[0-9]|2[0-3])',
        'H': '([0-9]|1[0-9]|2[0-3])',
        'hh': '(0[0-9]|1[0-2])',
        'h': '(1[0-2]|[0-9])',
        'kk': '(0[1-9]|1[0-9]|2[0-4])',
        'k': '(1[0-9]|2[0-4]|[1-9])',
        'mm': '(0[1-9]|[1-5][0-9])',
        'm': '([1-5][0-9]|[1-9])',
        'SSS': '([0-9][0-9][0-9])',
        'ss': '(0[1-9]|[1-5][0-9])',
        's': '([1-5][0-9]|[1-9])',
    },
    'en': {
        'localFormats': {
            'LLLL': 'dddd, MMMM D YYYY h:m A',
            'LLL': 'MMMM D YYYY h:m A',
            'LL': 'MMMM D YYYY',
            'L': 'DD/MM/YYYY',
            'LTS': 'h:m:s A',
            'LT': 'h:m A'
        },
        'monthsShortHand': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'months': ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'daysShortHand': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    'hi':{
        'localFormats': {
            'LLLL': 'dddd, MMMM D YYYY h:m A',
            'LLL': 'MMMM D YYYY h:m A',
            'LL': 'MMMM D YYYY',
            'L': 'DD/MM/YYYY',
            'LTS': 'h:m:s A',
            'LT': 'h:m A'
        },
        'monthsShortHand': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'months': ['जनवरी', 'फ़रवरी', 'मार्च ', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अकतूबर', 'नवंबर', 'दिसम्बर'],
        'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'daysShortHand': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
}

module.exports = localeSupport;