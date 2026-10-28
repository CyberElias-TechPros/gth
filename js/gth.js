/* =========================================================================
   Grand Tokyu Hotel — small progressive enhancements
   - quick availability bar -> booking page
   - booking / event / contact forms -> WhatsApp or email (nothing is sent
     automatically; the guest reviews the message before sending)
   - gallery filtering
   ========================================================================= */
(function () {
  'use strict';

  var HOTEL = {
    name: 'Grand Tokyu Hotel',
    whatsapp: '2349160007896',
    email: 'grandtokyuhotel@gmail.com'
  };

  var ROOM_NAMES = {
    'standard-room': 'Standard Room',
    'classic-room': 'Classic Room',
    'standard-suite': 'Standard Suite Room',
    'classic-suite': 'Classic Suite Room',
    apartment: 'The Apartment'
  };

  function isoDate(date) {
    var d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
  }

  function prettyDate(value) {
    if (!value) return '';
    var parts = String(value).split('-');
    if (parts.length !== 3) return value;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---------------------------------------------------------------- *
   *  Dates: sensible minimums
   * ---------------------------------------------------------------- */
  var today = new Date();
  var tomorrow = new Date(today.getTime() + 86400000);

  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    if (!input.min) input.min = isoDate(today);
    if (input.name === 'checkin' || input.id === 'qb-in') {
      if (!input.value) input.value = isoDate(today);
    }
    if (input.name === 'checkout' || input.id === 'qb-out') {
      if (!input.value) input.value = isoDate(tomorrow);
      if (!input.min) input.min = isoDate(tomorrow);
    }
    input.addEventListener('change', function () {
      // keep check-out after check-in
      var form = input.closest('form');
      if (!form) return;
      var inField = form.querySelector('input[name="checkin"], #qb-in');
      var outField = form.querySelector('input[name="checkout"], #qb-out');
      if (inField && outField && inField.value && outField.value && outField.value <= inField.value) {
        var next = new Date(inField.value);
        next.setDate(next.getDate() + 1);
        outField.value = isoDate(next);
      }
    });
  });

  /* ---------------------------------------------------------------- *
   *  Quick booking bar (home page)
   * ---------------------------------------------------------------- */
  var quickForm = document.getElementById('quick-booking');
  if (quickForm) {
    quickForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var params = new URLSearchParams();
      var room = quickForm.querySelector('#qb-room');
      var guests = quickForm.querySelector('#qb-guests');
      var checkin = quickForm.querySelector('#qb-in');
      var checkout = quickForm.querySelector('#qb-out');
      if (room && room.value) params.set('room', room.value);
      if (guests) params.set('guests', guests.value.replace(/[^0-9]/g, '') || '2');
      if (checkin) params.set('checkin', checkin.value);
      if (checkout) params.set('checkout', checkout.value);
      window.location.href = 'booking.html?' + params.toString();
    });
  }

  /* ---------------------------------------------------------------- *
   *  Prefill the booking form from the query string
   * ---------------------------------------------------------------- */
  var params = new URLSearchParams(window.location.search);
  var bookingForm = document.querySelector('[data-enquiry-form]');
  if (bookingForm && params.get('room')) {
    var slug = params.get('room');
    var select = bookingForm.querySelector('select[name="room"]');
    var wanted = ROOM_NAMES[slug] || slug;
    if (select) {
      Array.prototype.forEach.call(select.options, function (option) {
        if (option.value === wanted || option.value.indexOf(wanted) === 0) select.value = option.value;
      });
    }
    ['checkin', 'checkout'].forEach(function (field) {
      var value = params.get(field);
      var input = bookingForm.querySelector('[name="' + field + '"]');
      if (value && input) input.value = value;
    });
    var adults = bookingForm.querySelector('select[name="adults"]');
    var guests = params.get('guests');
    if (adults && guests && /^\d+$/.test(guests)) {
      Array.prototype.forEach.call(adults.options, function (option) {
        if (option.value === guests) adults.value = option.value;
      });
    }
  }

  /* ---------------------------------------------------------------- *
   *  Enquiry / booking forms -> WhatsApp or email
   * ---------------------------------------------------------------- */
  function collect(form) {
    var data = new FormData(form);
    var lines = ['Hello ' + HOTEL.name + ',', '', 'You have a new ' + (form.dataset.kind || 'enquiry') + ':', ''];
    var labels = {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      room: 'Room',
      checkin: 'Check-in',
      checkout: 'Check-out',
      adults: 'Adults',
      children: 'Children',
      date: 'Date',
      type: 'Event type',
      guests: 'Guests',
      subject: 'Subject',
      notes: 'Notes'
    };
    Object.keys(labels).forEach(function (key) {
      var raw = data.get(key);
      if (!raw) return;
      var value = raw;
      if (key === 'checkin' || key === 'checkout' || key === 'date') value = prettyDate(raw);
      lines.push(labels[key] + ': ' + value);
    });
    lines.push('', 'Sent from the Grand Tokyu Hotel website.');
    return lines.join('\n');
  }

  document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
    var senders = form.querySelectorAll('[data-send]');
    senders.forEach(function (button) {
      button.addEventListener('click', function () {
        form.dataset.mode = button.dataset.send;
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var mode = form.dataset.mode || 'whatsapp';
      var message = collect(form);
      if (mode === 'email') {
        var email = form.querySelector('[name="email"]');
        var subject = (form.dataset.kind || 'Enquiry') + ' — ' + (email && email.value ? email.value : 'website');
        window.location.href =
          'mailto:' + HOTEL.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
      } else {
        window.open('https://wa.me/' + HOTEL.whatsapp + '?text=' + encodeURIComponent(message), '_blank');
      }
    });
  });

  /* ---------------------------------------------------------------- *
   *  Gallery filters
   * ---------------------------------------------------------------- */
  var galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    var buttons = document.querySelectorAll('.filter-btn');
    var tiles = galleryGrid.querySelectorAll('.gallery-item');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        var filter = button.dataset.filter;
        tiles.forEach(function (tile) {
          var show = filter === 'all' || tile.dataset.group === filter;
          tile.classList.toggle('is-hidden', !show);
          tile.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      });
    });
  }
})();

/* -------------------------------------------------------------------------
   Safety net: if the reveal-animation library fails to load, or an element
   never gets its waypoint trigger, make sure nothing stays invisible.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';
  function revealAll() {
    document.querySelectorAll('.ftco-animate').forEach(function (el) {
      el.classList.add('ftco-animated', 'fadeIn');
    });
  }
  window.addEventListener('load', function () {
    if (typeof window.Waypoint === 'undefined' || !window.jQuery) revealAll();
    setTimeout(function () {
      document.querySelectorAll('.ftco-animate').forEach(function (el) {
        var box = el.getBoundingClientRect();
        var inView = box.top < window.innerHeight && box.bottom > 0;
        if (inView && window.getComputedStyle(el).visibility === 'hidden') {
          el.classList.add('ftco-animated', 'fadeIn');
        }
      });
      var loader = document.getElementById('ftco-loader');
      if (loader) loader.classList.remove('show');
    }, 900);
  });
})();
