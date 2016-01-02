/*global jQuery, window, document*/
/*jslint nomen:true, plusplus:true*/

(function ($) {
    $.widget('jed.monthlyReading', {
        _create: function () {
            this.books = {
                'gen': { name: '1. Mose (Genesis)', chapters: 50 },
                'exo': { name: '2. Mose (Exodus)', chapters: 40 },
                'lev': { name: '3. Mose (Levitikus)', chapters: 27 },
                'num': { name: '4. Mose (Numeri)', chapters: 36 },
                'deut': { name: '5. Mose (Deuteronomium)', chapters: 34 },
                'josh': { name: 'Josua', chapters: 24 },
                'judg': { name: 'Richter', chapters: 21 },
                'rth': { name: 'Rut', chapters: 4 },
                '1sam': { name: '1. Samuel', chapters: 31 },
                '2sam': { name: '2. Samuel', chapters: 24 },
                '1kgs': { name: '1. Könige', chapters: 22 },
                '2kgs': { name: '2. Könige', chapters: 25 },
                '1chron': { name: '1. Chronik', chapters: 29 },
                '2chron': { name: '2. Chronik', chapters: 36 },
                'ezra': { name: 'Esra', chapters: 10 },
                'neh': { name: 'Nehemia', chapters: 13 },
                'esth': { name: 'Esther', chapters: 10 },
                'job': { name: 'Hiob / Ijob', chapters: 42 },
                'pslm': { name: 'Psalmen', chapters: 150 },
                'pslmsSf': { name: 'Psalmen (gemischt)', chapters: 150, shuffle: true },
                'prov': { name: 'Sprüche / Sprichwörter', chapters: 31 },
                'eccles': { name: 'Prediger / Kohelet', chapters: 12 },
                'song': { name: 'Hoheslied', chapters: 8 },
                'isa': { name: 'Jesaja', chapters: 66 },
                'jer': { name: 'Jeremia', chapters: 52 },
                'lam': { name: 'Klagelieder', chapters: 5 },
                'ezek': { name: 'Ezechiel', chapters: 48 },
                'dan': { name: 'Daniel', chapters: 14 },
                'hos': { name: 'Hosea', chapters: 14 },
                'joel': { name: 'Joel', chapters: 4 },
                'amos': { name: 'Amos', chapters: 9 },
                'obad': { name: 'Obadja', chapters: 1 },
                'jnh': { name: 'Jona', chapters: 4 },
                'micah': { name: 'Micha', chapters: 7 },
                'nah': { name: 'Nahum', chapters: 3 },
                'hab': { name: 'Habakuk', chapters: 3 },
                'zeph': { name: 'Zefanja', chapters: 3 },
                'haggai': { name: 'Haggai', chapters: 2 },
                'zech': { name: 'Sacharja', chapters: 14 },
                'mal': { name: 'Maleachi', chapters: 3 },
                'matt': { name: 'Matthäus', chapters: 28 },
                'mrk': { name: 'Markus', chapters: 16 },
                'luk': { name: 'Lukas', chapters: 24 },
                'john': { name: 'Johannes', chapters: 21 },
                'acts': { name: 'Apostelgeschichte', chapters: 28 },
                'rom': { name: 'Römer', chapters: 16 },
                '1cor': { name: '1. Korinther', chapters: 16 },
                '2cor': { name: '2. Korinther', chapters: 13 },
                'gal': { name: 'Galater', chapters: 6 },
                'eph': { name: 'Epheser', chapters: 6 },
                'phil': { name: 'Philipper', chapters: 4 },
                'col': { name: 'Kolosser', chapters: 4 },
                '1thess': { name: '1. Thessalonicher', chapters: 5 },
                '2thess': { name: '2. Thessalonicher', chapters: 3 },
                '1tim': { name: '1. Timotheus', chapters: 6 },
                '2tim': { name: '2. Timotheus', chapters: 4 },
                'titus': { name: 'Titus', chapters: 3 },
                'philem': { name: 'Philemon', chapters: 1 },
                'hebrews': { name: 'Hebräer', chapters: 13 },
                'james': { name: 'Jakobus', chapters: 5 },
                '1pet': { name: '1. Petrus', chapters: 5 },
                '2pet': { name: '2. Petrus', chapters: 3 },
                '1john': { name: '1. Johannes', chapters: 5 },
                '2john': { name: '2. Johannes', chapters: 1 },
                '3john': { name: '3. Johannes', chapters: 1 },
                'jude': { name: 'Judas', chapters: 1 },
                'rev': { name: 'Offenbarung', chapters: 22 }
            };

            this.today = new Date();

            this.daysInMonth = this._getDaysInMonth(this.today);
            this.chapterContainer = this.element.find('#chapters');

            this.bookSelector = $('<div id="book-selector"></div>').appendTo(this.element.find('body'));

            this._generateBookSelector();

            this._on(this.bookSelector, {
                'change input': '_init'
            });

            this._on({
                'click #toggler': '_toggleSelector',
                'click #overlay': '_toggleSelector'
            })

        },
        _init: function () {
            this.selectedBooks = $('input:checkbox:checked').map(function () {
                return $(this).val();
            }).get();

            localStorage.setItem('checked', JSON.stringify(this.selectedBooks));

            this.chapterContainer.empty();
            for (iterator = 0; iterator < this.selectedBooks.length; iterator++) {
                this.getDailyReading(this.selectedBooks[ iterator ]);
            }
        },

        _generateBookSelector: function () {
            var self = this,
                iterator,
                checked,
                nodeString = '<ul class="unstyled">';
            $.each(this.books, function (key, data) {
                nodeString += '<li><label for="book-' + key + '"><input type="checkbox" id="book-' + key + '" name="books[]" value="' + key + '">' + data.name + '</label></li>';
            });
            nodeString += '</ul>';

            $(nodeString).appendTo(self.bookSelector);

            checked = JSON.parse(localStorage.getItem('checked'));
            if (checked) {
                for (iterator = 0; iterator < checked.length; iterator++) {
                    this.element.find('#book-' + checked[ iterator ]).attr('checked', 'checked')
                }
            }
        },

        _toggleSelector: function () {
            this.element.toggleClass('open');
        },

        _getDaysInMonth: function (date) {
            var month = date.getMonth(),
                year = date.getFullYear();

            return new Date(year, month + 1, 0).getDate();
        },

        _getChapters: function (book) {
            var iterator = 0,
                counter,
                chapters = [],
                day = this.today.getDate(),
                chaptersInBook = this.books[ book ].chapters,
                shuffle = this.books[ book ].shuffle || false,
                perDay = Math.floor(chaptersInBook / this.daysInMonth),
                overflow = chaptersInBook % this.daysInMonth;

            perDay = day > overflow ? perDay : perDay + 1;

            if (shuffle) {
                counter = day;

                for (; iterator < perDay; iterator++) {
                    if (counter > chaptersInBook) {
                        break;
                    }
                    chapters.push(counter);
                    counter += this.daysInMonth;
                }
                return chapters;
            }

            counter = day * perDay - perDay + 1;
            counter = day > overflow ? counter + overflow : counter;

            for (; iterator < perDay; iterator++) {
                if (counter > chaptersInBook) {
                    break;
                }
                chapters.push(counter);
                counter++;
            }
            return chapters;
        },

        getDailyReading: function (book) {
            var iterator,
                nodeString,
                chapters;

            chapters = this._getChapters(book);

            nodeString = '<h2>' + this.books[ book ].name + '</h2>';
            nodeString += '<ul>';
            for (iterator = 0; iterator < chapters.length; iterator++) {
                nodeString += '<li>Kapitel: ' + chapters[ iterator ] + '</li>';
            }

            nodeString += '</ul>';

            $(nodeString).appendTo(this.chapterContainer);
        }
    });
})(jQuery);
