(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;

    $('form').submit(function (event) {
      event.preventDefault();
    });

    // A tweet-sized JavaScript templating engine
    // http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
    function t(s,d){
     for(var p in d)
       s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
     return s;
    }

    var template = '<li class="row">' +
      '<div class="two columns mobile-one"><img src="{image}"></div>' +
      '<div class="ten columns">' +
        '<h4 class="name"><a href="{url}" target="_blank">{name}</a></h4>' +
        '<p class="description">{description}</p>' +
        // '<ul class="inline-list">' +
        //   '<li><a href="https://twitter.com/share" class="twitter-share-button" data-text="J\'ai découvert {name} : {url} via http://tbassetto.github.com/paris-tech-meetups/" data-lang="fr" data-count="none">Partager</a></li>' +
        // '</ul>' +
      '</div>' +
    '</li>';

    var $container = $('#meetup-container');

    function convertToJson(rawData) {
      var lines = rawData.split('\n'),
          meetups = [];

      for (var i = 1, l = lines.length; i < l; i++) {
        var meetup = lines[i].split(',');

        meetups[i-1] = {
          name: meetup[1],
          url: meetup[2],
          communitySize: meetup[3],
          description: meetup[4],
          frequency: meetup[5],
          type: meetup[6],
          twitter: meetup[7],
          mgmtTool: meetup[8],
          image: meetup[9] || 'http://placehold.it/80x80&text=-'
        };
      }

      return meetups;
    }

    // TODO: create the list using list.js and not jQUery
    $.get('https://docs.google.com/spreadsheet/pub?key=0AoJ_sHGz05sedEY5T016SmxjVHdPZXl2QmdnR0hmS1E&single=true&gid=0&output=csv', function(data) {
      var $ul = $('<ul class="list"></ul>'),
          meetups = convertToJson(data);

      meetups = meetups.sort(function (a, b) {
        // console.log('Compare', a.name, b.name, a.name > b.name)
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
        return 0;
      });

      for (var i = 0, l = meetups.length; i < l; i++) {
        $ul.append(t(template, meetups[i]));
      }

      $container.append($ul).removeClass('loading');

      // Make the list searchable
      var options = {
        valueNames: [ 'name', 'description' ]
      };
      var meetupList = new window.List('meetup-container', options);

      !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    });
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);