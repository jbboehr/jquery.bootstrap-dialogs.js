/*!
 * jQuery Bootstrap Dialogs Plugin
 * https://github.com/jbboehr/jquery.bootstrap-dialogs.js
 * 
 * Copyright 2013 John Boehr
 * Released under the MIT license
 */
(function(factory) {
  if( typeof define === 'function' && define.amd ) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function($) {
  
  function generate(options) {
    return [
      '<div class="modal' + (options.fade ? ' fade' : '') + '">',
        '<div class="modal-dialog">',
          '<div class="modal-content">',
            (options.title ? '<div class="modal-header">' + 
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                    '<h4>' + options.title + '</h4>' + '</div>' : ''),
            '<div class="modal-body">',
              '<p>', 
                (options.message || ''),
              '</p>',
              (options.input ? '<input class="input-xlarge" type="text" />' : ''),
            '</div>',
            '<div class="modal-footer">',
              (options.buttons.cancel ? '<a class="btn btn-default" data-index="2">' + (options.buttons.cancel || 'Cancel') + '</a>' : ''),
              (options.buttons.ok ? '<a class="btn btn-primary" data-index="1">' + (options.buttons.ok || 'OK') + '</a>' : ''),
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }
  
  function makeArgs(defaultButtonLabels, defaultTitle) {
    return function(message, callback, title, buttonLabels, defaultValue) {
      if( typeof(message) !== 'object' ) {
        message = {
          message : message,
          callback : callback,
          title : title,
          buttons : buttonLabels,
          value : defaultValue
        };
      }
      message.title = (message.title || defaultTitle || '');
      message.buttons = (message.buttons || defaultButtonLabels || 'OK');
      message.value = (message.value || defaultValue || '');
      if( typeof(message.buttons) === 'string' ) {
        message.buttons = message.buttons.split(',');
      }
      if( message.buttons instanceof Array ) {
        var obj = {};
        if( message.buttons.length >= 2 ) {
          obj.cancel = message.buttons[1];
        }
        if( message.buttons.length >= 1 ) {
          obj.ok = message.buttons[0];
        }
        message.buttons = obj;
      }
      return message;
    };
  }
  
  function makeDone(options, el) {
    var mutex;
    var tmp = el;
    return function() {
      if( mutex ) {
        return;
      }
      mutex = true;
      if( typeof(options.callback) === 'function' ) {
        options.callback.apply(null, arguments);
        options.callback = undefined;
      }
      if( tmp ) {
        tmp.on('hide hidden.bs.modal', function() {
          tmp.remove();
        }).modal('hide');
      }
      tmp = undefined;
    };
  }
  
  $.alert = function() {
    var options = makeArgs('OK').apply(null, arguments);
    var el = $(generate(options));
    var done = makeDone(options, el);
    
    el.on('hide hidden.bs.modal', done).on('click', '.btn', done).modal('show');
  };
  
  $.confirm = function() {
    var options = makeArgs('OK,Cancel').apply(null, arguments);
    var el = $(generate(options));
    var done = makeDone(options, el);
    
    el.on('hide hidden.bs.modal', done)
      .on('click', '.btn', function(event) {
        done(parseInt($(event.target).attr('data-index'), 10));
      }).modal('show');
  };
  
  $.prompt = function() {
    var options = makeArgs('OK,Cancel').apply(null, arguments);
    options.input = true;
    var el = $(generate(options));
    var done = makeDone(options, el);
    
    el.find('input').val(options.value + '');
    el.on('hide', done)
      .on('click', '.btn', function(event) {
        if( parseInt($(event.target).attr('data-index'), 10) === 1 ) {
          done(el.find('input').val());
        } else {
          done();
        }
      }).modal('show');
  };
  
}));
