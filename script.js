'use strict';
(() => {
  // 5 декабря 2026 года — суббота. Время местное, Красноярск / Кемерово (UTC+7).
  const start = new Date('2026-12-05T13:00:00+07:00');
  const end = new Date('2026-12-05T17:00:00+07:00');
  const $ = id => document.getElementById(id);
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionOff = motionPreference.matches;
  let cleanupTimer;

  function dayWord(n) {
    const last = n % 10, lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'дней';
    return last === 1 ? 'день' : last >= 2 && last <= 4 ? 'дня' : 'дней';
  }
  function updateCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, start.getTime() - now);
    const days = Math.floor(remaining / 86400000);
    $('days').textContent = String(days).padStart(2, '0');
    $('days-label').textContent = dayWord(days);
    $('hours').textContent = String(Math.floor(remaining / 3600000) % 24).padStart(2, '0');
    $('minutes').textContent = String(Math.floor(remaining / 60000) % 60).padStart(2, '0');
    if (now >= end.getTime()) {
      $('countdown-title').textContent = 'Спасибо за этот чудесный день!';
      $('countdown-message').textContent = 'Самые тёплые воспоминания — те, что мы создаём вместе ♡';
    } else if (remaining === 0) {
      $('countdown-title').textContent = 'Ура! Праздник уже начался!';
      $('countdown-message').textContent = 'Ждём тебя в «Притомье» — сегодня до 17:00!';
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 15000);

  function updateMotion() {
    document.body.classList.toggle('no-motion', motionOff);
    $('motion-button').textContent = motionOff ? 'Анимация: выкл.' : 'Анимация: вкл.';
    $('motion-button').setAttribute('aria-pressed', String(motionOff));
    $('motion-button').setAttribute('aria-label', motionOff ? 'Включить анимацию' : 'Выключить анимацию');
    if (motionOff) $('confetti').replaceChildren();
  }
  updateMotion();
  $('motion-button').addEventListener('click', () => { motionOff = !motionOff; updateMotion(); });
  motionPreference.addEventListener('change', event => { motionOff = event.matches; updateMotion(); });

  function celebrate() {
    $('party-message').textContent = 'Ура-а-а! Бери улыбку и приходи — будет здорово! ♡';
    if (motionOff) return;
    clearTimeout(cleanupTimer);
    const colors = ['#df8fab', '#b9a0d1', '#eac385', '#9ccbb9', '#e7a78c', '#d8c8ef'];
    const fragment = document.createDocumentFragment();
    $('confetti').replaceChildren();
    for (let i = 0; i < 85; i++) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--color', colors[i % colors.length]);
      piece.style.setProperty('--duration', `${2.8 + Math.random() * 2}s`);
      piece.style.setProperty('--delay', `${Math.random() * .65}s`);
      piece.style.setProperty('--drift', `${(Math.random() - .5) * 250}px`);
      piece.style.setProperty('--rotation', `${(Math.random() - .5) * 1300}deg`);
      if (i % 3 === 0) piece.style.borderRadius = '50%';
      fragment.append(piece);
    }
    $('confetti').append(fragment);
    cleanupTimer = setTimeout(() => $('confetti').replaceChildren(), 5600);
  }
  $('confetti-button').addEventListener('click', celebrate);

  $('calendar-button').addEventListener('click', () => {
    const calendar = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Little Birthday//Invitation RU//EN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:birthday-20261205T130000-pritomye@invitation.local',
      'DTSTAMP:20261119T000000Z', 'DTSTART:20261205T060000Z', 'DTEND:20261205T100000Z',
      'SUMMARY:Николь — 4 года! День рождения в «Притомье» 🎉', 'LOCATION:База отдыха «Притомье» (Берёзово)',
      'DESCRIPTION:Бассейн и сауна! С собой: плавки или купальник\\, полотенце\\, шлёпанцы. Малышам — ещё нарукавники или спасательный круг.',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Завтра идём на день рождения! Соберите вещи для бассейна.',
      'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    // Fold UTF-8 lines at 75 octets, as required by RFC 5545.
    const encoder = new TextEncoder();
    const folded = calendar.split('\r\n').map(line => {
      let result = '', octets = 0;
      for (const char of line) {
        const length = encoder.encode(char).length;
        if (octets + length > 75) { result += '\r\n '; octets = 1; }
        result += char; octets += length;
      }
      return result;
    }).join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([folded], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'birthday-05-december.ics';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
})();
