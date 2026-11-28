/* مساعد كتابة الملف: يركّب نبذة من خيارات العضو (قوالب محلية، لا يُرسل أي شيء لأي جهة) */
(function () {
  'use strict';
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var shuffle = function (a) { return a.map(function (x) { return [Math.random(), x]; }).sort(function (p, q) { return p[0] - q[0]; }).map(function (p) { return p[1]; }); };

  // key: [ar_m, ar_f, fr_m, fr_f, en, de]
  var TRAITS = {
    sincere: ['صادق', 'صادقة', 'sincère', 'sincère', 'sincere', 'ehrlich'],
    calm: ['هادئ الطباع', 'هادئة الطباع', 'calme', 'calme', 'calm', 'ruhig'],
    kind: ['طيّب القلب', 'طيّبة القلب', 'bienveillant', 'bienveillante', 'kind-hearted', 'herzlich'],
    ambitious: ['طموح', 'طموحة', 'ambitieux', 'ambitieuse', 'ambitious', 'ehrgeizig'],
    humor: ['خفيف الظل', 'خفيفة الظل', 'drôle', 'drôle', 'good-humoured', 'humorvoll'],
    responsible: ['مسؤول', 'مسؤولة', 'responsable', 'responsable', 'responsible', 'verantwortungsbewusst'],
    patient: ['صبور', 'صبورة', 'patient', 'patiente', 'patient', 'geduldig'],
    family: ['أحب أسرتي', 'أحب أسرتي', 'attaché à ma famille', 'attachée à ma famille', 'close to my family', 'familienverbunden'],
    respectful: ['محترم', 'محترمة', 'respectueux', 'respectueuse', 'respectful', 'respektvoll'],
    simple: ['بسيط', 'بسيطة', 'simple', 'simple', 'down-to-earth', 'bodenständig']
  };
  var HOBBIES = {
    reading: ['القراءة', 'la lecture', 'reading', 'Lesen'],
    travel: ['السفر', 'les voyages', 'travelling', 'Reisen'],
    sport: ['الرياضة', 'le sport', 'sports', 'Sport'],
    cooking: ['الطبخ', 'la cuisine', 'cooking', 'Kochen'],
    nature: ['الطبيعة والمشي', 'la nature et la marche', 'nature and walking', 'Natur und Spaziergänge'],
    learning: ['تعلّم أشياء جديدة', 'apprendre de nouvelles choses', 'learning new things', 'Neues zu lernen'],
    quran: ['تلاوة القرآن', 'la récitation du Coran', 'reciting the Quran', 'Koranrezitation'],
    family: ['قضاء الوقت مع العائلة', 'passer du temps en famille', 'spending time with family', 'Zeit mit der Familie']
  };
  // ما أبحث عنه: [ar_شريك(مذكر), ar_شريكة(مؤنث), fr, en, de]
  var SEEK = {
    religious: ['ملتزم بدينه', 'ملتزمة بدينها', 'attachée à sa religion', 'committed to their faith', 'gläubig'],
    kind: ['طيّب القلب', 'طيّبة القلب', 'bienveillante', 'kind-hearted', 'herzlich'],
    family: ['يحب الأسرة', 'تحب الأسرة', 'attachée à la famille', 'family-oriented', 'familienorientiert'],
    honest: ['صادق', 'صادقة', 'sincère', 'honest', 'aufrichtig'],
    understanding: ['متفاهم', 'متفاهمة', 'compréhensive', 'understanding', 'verständnisvoll'],
    ambitious: ['طموح', 'طموحة', 'ambitieuse', 'ambitious', 'ehrgeizig'],
    kids: ['يحب الأطفال', 'تحب الأطفال', 'attentionnée envers les enfants', 'fond of children', 'kinderlieb'],
    respectful: ['محترم', 'محترمة', 'respectueuse', 'respectful', 'respektvoll']
  };

  var EDU = {
    ar: { secondary: 'مستواي الدراسي ثانوي', diploma: 'أحمل دبلوماً', bachelor: 'حاصل على إجازة', postgraduate: 'أتابع/أنهيت دراسات عليا' },
    fr: { secondary: 'niveau secondaire', diploma: 'diplôme', bachelor: 'licence', postgraduate: 'master / doctorat' },
    en: { secondary: 'high-school education', diploma: 'diploma', bachelor: 'bachelor\'s degree', postgraduate: 'postgraduate studies' },
    de: { secondary: 'Schulabschluss', diploma: 'Diplom', bachelor: 'Bachelorabschluss', postgraduate: 'Master-/Promotionsstudium' }
  };

  function list(arr, and, ar) {
    if (arr.length <= 1) return arr.join('');
    if (ar) return arr.slice(0, -1).join('، ') + ' و' + arr[arr.length - 1];
    return arr.slice(0, -1).join(', ') + ' ' + and + ' ' + arr[arr.length - 1];
  }
  function sel(map, keys, idx) { return keys.filter(function (k) { return map[k]; }).map(function (k) { return map[k][idx]; }); }

  // d: {lang, tone, gender, age, city, occupation, marital, education, religiosity, prayer, smoking, children, traits[], hobbies[], seek[]}
  function build(d) {
    var f = d.gender === 'female', L = d.lang, bio = [], look = '';
    var T = d.tone || 'warm';
    if (L === 'ar') {
      var who = f ? 'شابة' : 'شاب';
      var mar = { never_married: 'لم يسبق لي الزواج', divorced: f ? 'مطلّقة' : 'مطلّق', widowed: f ? 'أرملة' : 'أرمل' }[d.marital];
      var s1 = 'أنا ' + who + (d.age ? ' عمري ' + d.age + ' سنة' : '') + (d.city ? ' من ' + d.city : '') + '.';
      bio.push(s1);
      if (d.occupation) bio.push(pick(['أعمل في مجال: ', 'مهنتي: ']) + d.occupation + '.');
      if (d.education && EDU.ar[d.education]) bio.push(EDU.ar[d.education].replace('حاصل', f ? 'حاصلة' : 'حاصل') + '.');
      if (mar && d.marital !== 'never_married') bio.push('وضعي: ' + mar + '.');
      var rel = { practicing: 'أحرص على الالتزام بديني', moderate: 'أسير في ديني باعتدال', learning: 'أسعى لتحسين التزامي وتقوية إيماني' }[d.religiosity];
      var pr = { always: 'وأحافظ على صلاتي', mostly: 'وأحافظ على صلاتي غالباً', sometimes: 'وأسعى لتنظيم صلاتي', rarely: 'وأسعى للمحافظة على صلاتي' }[d.prayer];
      if (rel) bio.push(rel + (pr ? ' ' + pr : '') + '.'); else if (pr) bio.push(pr.slice(1) + '.');
      var tr = sel(TRAITS, d.traits, f ? 1 : 0);
      if (tr.length && T !== 'short') bio.push(pick(['أراني ', 'أتصف بأنني ', 'من صفاتي أنني ']) + list(tr, 'و', true) + '.');
      var hb = sel(HOBBIES, d.hobbies, 0);
      if (hb.length && T !== 'short') bio.push(pick(['أحب ', 'من هواياتي ']) + list(hb, 'و', true) + '.');
      if (d.smoking === 'no') bio.push('لا أدخّن.'); else if (d.smoking === 'quit') bio.push('أقلعت عن التدخين.');
      if (d.children === 'yes') bio.push('أتمنى تكوين أسرة مستقرة وأن أرزق بأطفال.'); else if (d.children === 'open') bio.push('أنا منفتح' + (f ? 'ة' : '') + ' على موضوع الأطفال.');
      if (T === 'warm') bio.push(pick(['أبحث عن زواج جاد على بركة الله.', 'أتمنى أن أجد شريك' + (f ? '' : 'ة') + ' حياة نبني معاً بيتاً قائماً على المودة والرحمة.']));
      if (T === 'serious') bio.push('هدفي زواج جاد وفق ضوابط الشرع، وأرحّب بالتعارف الهادف.');
      var sk = sel(SEEK, d.seek, f ? 0 : 1);
      look = 'أبحث عن شريك' + (f ? '' : 'ة') + ' حياة' + (sk.length ? ' ' + list(sk, 'و', true) : '') + '، ' + pick(['نبني معاً أسرة مستقرة.', 'يجمعنا الاحترام والتفاهم وخوف الله.', 'نسير نحو زواج جاد وبيت هادئ.']);
      if (!sk.length) look = 'أبحث عن شريك' + (f ? '' : 'ة') + ' حياة ' + (f ? 'محترماً' : 'محترمة') + '، ' + pick(['نبني معاً أسرة مستقرة.', 'يجمعنا الاحترام والتفاهم.']);
    } else if (L === 'fr') {
      var mf = f ? 3 : 2;
      bio.push(d.age ? 'J\'ai ' + d.age + ' ans' + (d.city ? ' et je vis à ' + d.city : '') + '.' : (d.city ? 'Je vis à ' + d.city + '.' : 'Bonjour.'));
      if (d.occupation) bio.push('Profession : ' + d.occupation + '.');
      if (d.education && EDU.fr[d.education]) bio.push('Formation : ' + EDU.fr[d.education] + '.');
      var rf = { practicing: 'Je suis pratiquant' + (f ? 'e' : '') + ' et attaché' + (f ? 'e' : '') + ' à ma religion', moderate: 'Je vis ma religion avec modération', learning: 'Je suis sur le chemin d\'un engagement religieux plus fort' }[d.religiosity];
      if (rf) bio.push(rf + '.');
      var t2 = sel(TRAITS, d.traits, mf); if (t2.length && T !== 'short') bio.push('Je me décris comme ' + list(t2, 'et') + '.');
      var h2 = sel(HOBBIES, d.hobbies, 1); if (h2.length && T !== 'short') bio.push('J\'aime ' + list(h2, 'et') + '.');
      if (d.smoking === 'no') bio.push('Je ne fume pas.');
      if (d.children === 'yes') bio.push('Je souhaite fonder une famille et avoir des enfants.');
      if (T !== 'short') bio.push('Je cherche un mariage sérieux, dans le respect et la sincérité.');
      var s2 = sel(SEEK, d.seek, 2);
      look = 'Je recherche une personne ' + (s2.length ? list(s2, 'et') : 'respectueuse et sincère') + ', avec qui bâtir une famille stable.';
    } else if (L === 'en') {
      bio.push(d.age ? 'I\'m ' + d.age + ' years old' + (d.city ? ' and live in ' + d.city : '') + '.' : (d.city ? 'I live in ' + d.city + '.' : 'Hello.'));
      if (d.occupation) bio.push('Occupation: ' + d.occupation + '.');
      if (d.education && EDU.en[d.education]) bio.push('Education: ' + EDU.en[d.education] + '.');
      var re = { practicing: 'I\'m a practising Muslim and care about my faith', moderate: 'I practise my faith in a balanced way', learning: 'I\'m working on strengthening my practice' }[d.religiosity];
      if (re) bio.push(re + '.');
      var t3 = sel(TRAITS, d.traits, 4); if (t3.length && T !== 'short') bio.push('People describe me as ' + list(t3, 'and') + '.');
      var h3 = sel(HOBBIES, d.hobbies, 2); if (h3.length && T !== 'short') bio.push('I enjoy ' + list(h3, 'and') + '.');
      if (d.smoking === 'no') bio.push('I don\'t smoke.');
      if (d.children === 'yes') bio.push('I hope to build a family and have children.');
      if (T !== 'short') bio.push('I\'m looking for a serious relationship that leads to marriage, built on respect and honesty.');
      var s3 = sel(SEEK, d.seek, 3);
      look = 'I\'m looking for a life partner who is ' + (s3.length ? list(s3.map(function (x) { return x.replace(/^who is /, ''); }), 'and') : 'respectful and sincere') + ', to build a stable family together.';
      look = look.replace('who is who', 'who');
    } else {
      bio.push(d.age ? 'Ich bin ' + d.age + ' Jahre alt' + (d.city ? ' und lebe in ' + d.city : '') + '.' : (d.city ? 'Ich lebe in ' + d.city + '.' : 'Hallo.'));
      if (d.occupation) bio.push('Beruf: ' + d.occupation + '.');
      if (d.education && EDU.de[d.education]) bio.push('Ausbildung: ' + EDU.de[d.education] + '.');
      var rd = { practicing: 'Mein Glaube ist mir wichtig und ich praktiziere ihn', moderate: 'Ich lebe meinen Glauben ausgewogen', learning: 'Ich arbeite daran, meinen Glauben zu stärken' }[d.religiosity];
      if (rd) bio.push(rd + '.');
      var t4 = sel(TRAITS, d.traits, 5); if (t4.length && T !== 'short') bio.push('Ich bin ' + list(t4, 'und') + '.');
      var h4 = sel(HOBBIES, d.hobbies, 3); if (h4.length && T !== 'short') bio.push('Ich mag ' + list(h4, 'und') + '.');
      if (d.smoking === 'no') bio.push('Ich rauche nicht.');
      if (d.children === 'yes') bio.push('Ich wünsche mir eine Familie mit Kindern.');
      if (T !== 'short') bio.push('Ich suche eine ernsthafte Beziehung mit dem Ziel der Ehe, geprägt von Respekt und Ehrlichkeit.');
      var s4 = sel(SEEK, d.seek, 4);
      look = 'Ich suche einen Lebenspartner bzw. eine Lebenspartnerin, der/die ' + (s4.length ? list(s4, 'und') : 'respektvoll und aufrichtig') + ' ist, um gemeinsam eine stabile Familie zu gründen.';
    }
    return { bio: bio.join(' ').replace(/\s+/g, ' ').trim(), looking_for: look.trim() };
  }
  window.ProfileAssistant = { build: build, TRAITS: TRAITS, HOBBIES: HOBBIES, SEEK: SEEK };
})();
