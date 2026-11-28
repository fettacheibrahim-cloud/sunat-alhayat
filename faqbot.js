/* مساعد الأسئلة: يجيب من قاعدة أجوبة ثابتة داخل المتصفح، دون إرسال أي شيء لأي جهة */
(function () {
  'use strict';
  var L = ['ar', 'fr', 'en', 'de'].indexOf(window.I18N_LANG) >= 0 ? window.I18N_LANG : 'ar';
  var UI = {
    ar: { btn: '💬 اسأل', title: 'مساعد «سنة الحياة»', hi: 'السلام عليكم! اسألني عن الموقع، أو اختر سؤالاً:', ph: 'اكتب سؤالك…', send: 'إرسال', none: 'لم أجد جواباً دقيقاً لسؤالك. جرّب أحد الأسئلة التالية أو راسلنا من صفحة التواصل.', more: 'اقرأ المزيد', close: 'إغلاق', note: 'أجوبة جاهزة، وليست مستشاراً شرعياً ولا قانونياً.' },
    fr: { btn: '💬 Questions', title: 'Assistant Sunat Al-Hayat', hi: 'Salam ! Posez-moi une question sur le site, ou choisissez-en une :', ph: 'Écrivez votre question…', send: 'Envoyer', none: 'Je n\'ai pas de réponse précise. Essayez l\'une des questions ci-dessous ou écrivez-nous via la page contact.', more: 'En savoir plus', close: 'Fermer', note: 'Réponses prédéfinies ; ce n\'est pas un conseil religieux ni juridique.' },
    en: { btn: '💬 Ask', title: 'Sunat Al-Hayat assistant', hi: 'Assalamu alaikum! Ask me about the site, or pick a question:', ph: 'Type your question…', send: 'Send', none: 'I couldn\'t find a precise answer. Try one of the questions below or write to us via the contact page.', more: 'Read more', close: 'Close', note: 'Ready-made answers; not religious or legal advice.' },
    de: { btn: '💬 Fragen', title: 'Sunat-Al-Hayat-Assistent', hi: 'Assalamu alaikum! Frag mich zur Website oder wähle eine Frage:', ph: 'Deine Frage…', send: 'Senden', none: 'Ich habe keine passende Antwort gefunden. Probiere eine der Fragen unten oder schreibe uns über die Kontaktseite.', more: 'Mehr lesen', close: 'Schließen', note: 'Vorgefertigte Antworten; keine religiöse oder rechtliche Beratung.' }
  }[L];

  // k: كلمات مفتاحية (بعد التطبيع) بكل اللغات والدارجة؛ q/a: [ar, fr, en, de]
  var KB = [
    { k: ['ما هو سنه', 'ما هو الموقع', 'ايش هو', 'شنو هو', 'عن الموقع', 'نبذه عن', 'sunat', 'سنه الحياه', 'about', 'ueber uns', 'a propos'],
      q: ['ما هو «سنة الحياة»؟', 'Qu\'est-ce que Sunat Al-Hayat ?', 'What is Sunat Al-Hayat?', 'Was ist Sunat Al-Hayat?'],
      a: ['منصة للتعارف بنيّة الزواج الجاد فقط، على أساس الاحترام والخصوصية. وليست موقعاً للتسلية أو العلاقات غير المشروعة.', 'Une plateforme de rencontre uniquement dans une optique de mariage sérieux, fondée sur le respect et la confidentialité. Ce n\'est pas un site de divertissement.', 'A platform for getting to know each other with serious marriage intentions only, built on respect and privacy. It is not for entertainment or casual relationships.', 'Eine Plattform zum Kennenlernen ausschließlich mit der Absicht einer ernsthaften Ehe, auf Basis von Respekt und Privatsphäre. Keine Unterhaltungs- oder Gelegenheitsseite.'], l: 'about.html' },
    { k: ['مجاني', 'مجانا', 'بلاش', 'سعر', 'ثمن', 'كم', 'فلوس', 'تكلف', 'gratuit', 'prix', 'combien', 'free', 'price', 'cost', 'kostenlos', 'preis', 'kostet', 'gratis'],
      q: ['هل التسجيل مجاني؟', 'L\'inscription est-elle gratuite ?', 'Is registration free?', 'Ist die Anmeldung kostenlos?'],
      a: ['نعم، التسجيل وتصفّح الأعضاء مجانيان. وهناك عضوية «مميزة» اختيارية بمزايا إضافية، وأول 30 عضواً يحصلون عليها مجاناً لمدة 3 أشهر.', 'Oui, l\'inscription et la navigation sont gratuites. Il existe un abonnement « Premium » optionnel ; les 30 premiers membres l\'obtiennent gratuitement pendant 3 mois.', 'Yes, registration and browsing are free. An optional “Premium” membership exists; the first 30 members get it free for 3 months.', 'Ja, Anmeldung und Stöbern sind kostenlos. Es gibt eine optionale „Premium“-Mitgliedschaft; die ersten 30 Mitglieder erhalten sie 3 Monate gratis.'], l: 'premium.html' },
    { k: ['تسجيل', 'سجل', 'اسجل', 'اشترك', 'انشاء حساب', 'حساب جديد', 'كيف ابدا', 'كيف ادخل', 'inscri', 'creer un compte', 'commencer', 'register', 'sign up', 'signup', 'create account', 'get started', 'anmeld', 'registrier', 'konto erstellen'],
      q: ['كيف أسجّل؟', 'Comment m\'inscrire ?', 'How do I sign up?', 'Wie melde ich mich an?'],
      a: ['اضغط «ابدأ الآن»، ثم سجّل بالبريد أو بحساب Google، وأكمل ملفك (الاسم، تاريخ الميلاد، البلد، نبذة…). الشرط أن تكون 18 سنة فأكثر.', 'Appuyez sur « Commencer », inscrivez-vous par e-mail ou avec Google, puis complétez votre profil. Il faut avoir 18 ans ou plus.', 'Tap “Get started”, sign up by email or with Google, then complete your profile. You must be 18 or older.', 'Tippe auf „Jetzt starten“, melde dich per E-Mail oder mit Google an und vervollständige dein Profil. Du musst mindestens 18 sein.'], l: 'auth.html' },
    { k: ['قيد المراجعة', 'مراجعة', 'قبول', 'مقبول', 'متى يقبل', 'تفعيل', 'pending', 'approv', 'validation', 'valid', 'en attente', 'freischalt', 'pruef', 'review'],
      q: ['متى يُقبل حسابي؟', 'Quand mon compte est-il accepté ?', 'When is my account approved?', 'Wann wird mein Konto freigeschaltet?'],
      a: ['يُقبل حسابك تلقائياً عند اكتمال ملفك: كل الحقول الأساسية، ونبذة من 30 حرفاً فأكثر دون أرقام هاتف أو روابط أو حسابات تواصل. وإلا يُراجَع يدوياً.', 'Votre compte est accepté automatiquement lorsque votre profil est complet : champs principaux remplis et présentation d\'au moins 30 caractères, sans numéro, lien ni compte de contact. Sinon il est examiné manuellement.', 'Your account is approved automatically once your profile is complete: main fields filled and a bio of at least 30 characters with no phone numbers, links or contact handles. Otherwise it is reviewed manually.', 'Dein Konto wird automatisch freigeschaltet, sobald dein Profil vollständig ist: Hauptfelder ausgefüllt und eine Beschreibung mit mindestens 30 Zeichen ohne Telefonnummern, Links oder Kontaktkonten. Andernfalls wird es manuell geprüft.'], l: 'faq.html' },
    { k: ['خصوصيه', 'يرى ملفي', 'من يرى', 'يشوف', 'صورتي', 'صورة', 'صور', 'بياناتي', 'privacy', 'confidential', 'mes donnees', 'ma photo', 'photo', 'datenschutz', 'privatsphaere', 'meine daten', 'foto'],
      q: ['من يرى ملفي وصورتي؟', 'Qui voit mon profil et ma photo ?', 'Who can see my profile and photo?', 'Wer sieht mein Profil und mein Foto?'],
      a: ['يراه الأعضاء المسجّلون فقط، ولا تظهر أي بيانات تواصل. ويمكنك جعل صورتك تظهر للطرف الآخر بعد قبول الاهتمام فقط، من صفحة «ملفي».', 'Seuls les membres inscrits le voient et aucune coordonnée n\'est affichée. Vous pouvez ne montrer votre photo qu\'après acceptation de l\'intérêt, depuis « Mon profil ».', 'Only registered members can see it, and no contact details are shown. You can show your photo only after an interest is accepted, from “My profile”.', 'Nur registrierte Mitglieder sehen es, Kontaktdaten werden nicht angezeigt. Du kannst dein Foto erst nach angenommenem Interesse zeigen, unter „Mein Profil“.'], l: 'legal.html' },
    { k: ['واتساب', 'واتس', 'رقم', 'هاتف', 'تلفون', 'تواصل خارج', 'whatsapp', 'telephone', 'numero', 'phone', 'number', 'handy', 'nummer'],
      q: ['هل أستطيع وضع رقمي في ملفي؟', 'Puis-je mettre mon numéro dans mon profil ?', 'Can I put my number in my profile?', 'Darf ich meine Nummer ins Profil schreiben?'],
      a: ['لا. أرقام الهاتف والبريد والروابط وحسابات التواصل غير مسموحة في الملف، وتُحجب في أول المراسلات لحمايتك من الإزعاج والاحتيال.', 'Non. Numéros, e-mails, liens et comptes de contact sont interdits dans le profil et masqués dans les premiers messages pour vous protéger du harcèlement et de la fraude.', 'No. Phone numbers, emails, links and contact handles are not allowed in profiles and are masked in early messages to protect you from harassment and fraud.', 'Nein. Telefonnummern, E-Mails, Links und Kontaktkonten sind im Profil nicht erlaubt und werden in den ersten Nachrichten ausgeblendet – zum Schutz vor Belästigung und Betrug.'], l: 'faq.html' },
    { k: ['جنسية', 'جنسيات', 'اجنبي', 'اجنبيه', 'اجانب', 'بلد', 'خارج المغرب', 'مهاجر', 'nationalit', 'etranger', 'pays', 'foreign', 'country', 'abroad', 'staatsangehoer', 'ausland', 'land', 'auslaender'],
      q: ['هل الموقع لجميع الجنسيات؟', 'Le site est-il ouvert à toutes les nationalités ?', 'Is the site open to all nationalities?', 'Ist die Seite für alle Nationalitäten offen?'],
      a: ['نعم، مفتوح لجميع الجنسيات والبلدان. يمكنك التصفية حسب البلد والمدينة، وتوجد ترجمة داخل المحادثة بين العربية والفرنسية والإنجليزية والألمانية.', 'Oui, ouvert à toutes les nationalités. Vous pouvez filtrer par pays et ville, et la conversation propose une traduction entre arabe, français, anglais et allemand.', 'Yes, it is open to all nationalities and countries. You can filter by country and city, and chats offer translation between Arabic, French, English and German.', 'Ja, offen für alle Nationalitäten und Länder. Du kannst nach Land und Stadt filtern, und der Chat bietet Übersetzung zwischen Arabisch, Französisch, Englisch und Deutsch.'], l: 'browse.html' },
    { k: ['ترجمة', 'ترجم', 'لغة', 'لغات', 'تتكلم', 'traduction', 'traduire', 'langue', 'translat', 'language', 'uebersetz', 'sprache'],
      q: ['ما اللغات المتاحة وهل توجد ترجمة؟', 'Quelles langues et y a-t-il une traduction ?', 'Which languages are available, and is there translation?', 'Welche Sprachen gibt es und gibt es Übersetzung?'],
      a: ['الموقع بأربع لغات: العربية والفرنسية والإنجليزية والألمانية. وفي المحادثة زر ترجمة للرسائل، وترجمة لرسالتك قبل الإرسال، واقتراحات لأول رسالة.', 'Le site est en quatre langues : arabe, français, anglais, allemand. Le chat propose un bouton de traduction, la traduction de votre message avant envoi et des suggestions de premier message.', 'The site is in four languages: Arabic, French, English, German. Chats have a translate button, translation of your message before sending, and first-message suggestions.', 'Die Seite gibt es auf Arabisch, Französisch, Englisch und Deutsch. Im Chat gibt es einen Übersetzen-Knopf, die Übersetzung deiner Nachricht vor dem Senden und Vorschläge für die erste Nachricht.'], l: 'faq.html' },
    { k: ['مميز', 'بريميوم', 'premium', 'vip', 'اشتراك مدفوع', 'عضوية', 'abonnement', 'mitgliedschaft'],
      q: ['ما العضوية المميزة؟', 'Qu\'est-ce que l\'abonnement Premium ?', 'What is Premium membership?', 'Was ist die Premium-Mitgliedschaft?'],
      a: ['خيار اختياري بمزايا إضافية وشارة «مميز». الأسعار والمدد في صفحة العضوية المميزة. وأول 30 عضواً مجاناً 3 أشهر، ويمكنك كسب أيام إضافية بدعوة أصدقاء (7 أيام لكل صديق، حتى 8 أصدقاء).', 'Option facultative avec des avantages et un badge « Premium ». Tarifs et durées sur la page dédiée. Les 30 premiers membres l\'ont gratuitement 3 mois, et vous gagnez des jours en invitant des amis (7 jours par ami, jusqu\'à 8).', 'An optional plan with extra benefits and a “Premium” badge. Prices and durations are on the Premium page. The first 30 members get 3 months free, and you can earn extra days by inviting friends (7 days per friend, up to 8).', 'Eine optionale Mitgliedschaft mit Zusatzvorteilen und „Premium“-Abzeichen. Preise und Laufzeiten stehen auf der Premium-Seite. Die ersten 30 Mitglieder erhalten 3 Monate gratis, und durch Einladungen gibt es Zusatztage (7 Tage pro Freund, bis zu 8).'], l: 'premium.html' },
    { k: ['توثيق', 'موثق', 'شارة', 'علامة', 'verifi', 'badge', 'verifie', 'verifiz', 'abzeichen'],
      q: ['ما شارة التوثيق؟', 'Qu\'est-ce que le badge de vérification ?', 'What is the verified badge?', 'Was ist das Verifizierungs-Abzeichen?'],
      a: ['شارة «موثّق» اختيارية تزيد ثقة الأعضاء بملفك، وتقوم على مقارنة صورة تحقق بصور ملفك، ولا تظهر صورة التحقق لأي عضو. التفاصيل والسعر في صفحة التوثيق.', 'Un badge « vérifié » optionnel qui renforce la confiance : une photo de vérification est comparée à celles de votre profil et n\'est jamais montrée aux membres. Détails et prix sur la page de vérification.', 'An optional “verified” badge that builds trust: a verification photo is compared with your profile photos and never shown to members. Details and price are on the verification page.', 'Ein optionales „Verifiziert“-Abzeichen, das Vertrauen schafft: Ein Verifizierungsfoto wird mit deinen Profilfotos verglichen und nie Mitgliedern gezeigt. Details und Preis auf der Verifizierungsseite.'], l: 'verify.html' },
    { k: ['مال', 'فلوس', 'نصب', 'احتيال', 'ابتزاز', 'امان', 'آمن', 'خطر', 'argent', 'arnaque', 'securite', 'danger', 'scam', 'money', 'safe', 'fraud', 'geld', 'betrug', 'sicher'],
      q: ['كيف أتعارف بأمان؟ وهل يطلب أحد مالاً؟', 'Comment échanger en sécurité ? Va-t-on me demander de l\'argent ?', 'How do I stay safe? Will anyone ask for money?', 'Wie bleibe ich sicher? Verlangt jemand Geld?'],
      a: ['لا ترسل مالاً لأي شخص مهما كانت القصة، ولا تشارك بيانات بنكية، وأبلغ فوراً عن أي طلب مال. التقِ بحضور الأهل في مكان عام، وتحقق من الشخص قبل أي خطوة.', 'N\'envoyez jamais d\'argent, quelle que soit l\'histoire, ne partagez pas de données bancaires, et signalez toute demande. Rencontrez-vous en présence de vos familles dans un lieu public et renseignez-vous sur la personne.', 'Never send money, whatever the story, never share bank details, and report any request for money. Meet with family present in a public place and check the person out first.', 'Sende nie Geld, egal welche Geschichte erzählt wird, teile keine Bankdaten und melde jede Geldforderung. Triff dich im Beisein der Familie an einem öffentlichen Ort und erkundige dich vorher über die Person.'], l: 'faq.html' },
    { k: ['حظر', 'ابلاغ', 'بلاغ', 'مزعج', 'تحرش', 'bloquer', 'signaler', 'harcel', 'block', 'report', 'harass', 'blockier', 'melden', 'belaestig'],
      q: ['كيف أحظر عضواً أو أبلّغ عنه؟', 'Comment bloquer ou signaler un membre ?', 'How do I block or report a member?', 'Wie blockiere oder melde ich ein Mitglied?'],
      a: ['من داخل المحادثة اختر «حظر» أو «إبلاغ». بعد الحظر لا يظهر أحدكما للآخر، وتراجع الإدارة البلاغات.', 'Depuis la conversation, choisissez « Bloquer » ou « Signaler ». Après un blocage, vous ne vous voyez plus ; l\'administration examine les signalements.', 'From the chat choose “Block” or “Report”. After a block you no longer see each other, and the admins review reports.', 'Wähle im Chat „Blockieren“ oder „Melden“. Nach dem Blockieren seht ihr euch nicht mehr; das Team prüft Meldungen.'], l: 'faq.html' },
    { k: ['حذف', 'احذف', 'مسح حسابي', 'الغاء', 'supprim', 'effacer', 'delete', 'remove my', 'loesch', 'entfern'],
      q: ['كيف أحذف حسابي؟', 'Comment supprimer mon compte ?', 'How do I delete my account?', 'Wie lösche ich mein Konto?'],
      a: ['من صفحة «ملفي» اضغط «حذف حسابي نهائياً» في آخر الصفحة. يُحذف حسابك وبياناتك.', 'Dans « Mon profil », appuyez sur « Supprimer définitivement mon compte » en bas de page. Votre compte et vos données sont supprimés.', 'On “My profile”, press “Delete my account permanently” at the bottom. Your account and data are removed.', 'Unter „Mein Profil“ ganz unten auf „Mein Konto endgültig löschen“ tippen. Konto und Daten werden gelöscht.'], l: 'profile.html' },
    { k: ['نسيت', 'كلمة المرور', 'كلمة السر', 'باسوورد', 'mot de passe', 'oublie', 'password', 'forgot', 'passwort', 'vergessen'],
      q: ['نسيت كلمة المرور', 'J\'ai oublié mon mot de passe', 'I forgot my password', 'Ich habe mein Passwort vergessen'],
      a: ['في صفحة الدخول اضغط «نسيت كلمة المرور» وأدخل بريدك، فيصلك رابط لإعادة التعيين.', 'Sur la page de connexion, appuyez sur « Mot de passe oublié » et saisissez votre e-mail : vous recevrez un lien de réinitialisation.', 'On the login page press “Forgot password” and enter your email; you will get a reset link.', 'Auf der Anmeldeseite „Passwort vergessen“ antippen und die E-Mail eingeben; du erhältst einen Link zum Zurücksetzen.'], l: 'reset.html' },
    { k: ['تثبيت', 'تطبيق', 'اندرويد', 'ايفون', 'install', 'application', 'telecharger', 'app', 'download', 'herunterlad'],
      q: ['هل يوجد تطبيق للهاتف؟', 'Existe-t-il une application ?', 'Is there a mobile app?', 'Gibt es eine App?'],
      a: ['نعم، يمكنك تثبيت الموقع كتطبيق على هاتفك دون متجر: من متصفح Chrome اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».', 'Oui, vous pouvez installer le site comme application sans passer par un store : dans Chrome, choisissez « Installer l\'application » ou « Ajouter à l\'écran d\'accueil ».', 'Yes, you can install the site as an app without a store: in Chrome choose “Install app” or “Add to Home screen”.', 'Ja, du kannst die Seite ohne Store als App installieren: In Chrome „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.'], l: 'install.html' },
    { k: ['تواصل معنا', 'اتصل', 'بريد الموقع', 'دعم', 'مساعدة', 'مشكلة', 'contact', 'support', 'aide', 'probleme', 'help', 'kontakt', 'hilfe'],
      q: ['كيف أتواصل مع الإدارة؟', 'Comment contacter l\'équipe ?', 'How do I contact the team?', 'Wie kontaktiere ich das Team?'],
      a: ['من صفحة التواصل يمكنك مراسلتنا، وسنرد في أقرب وقت.', 'Écrivez-nous depuis la page contact ; nous répondons dès que possible.', 'Write to us from the contact page and we will reply as soon as possible.', 'Schreibe uns über die Kontaktseite; wir antworten so schnell wie möglich.'], l: 'contact.html' }
  ];

  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[ؤ]/g, 'و').replace(/[ئ]/g, 'ي')
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ß/g, 'ss').replace(/[^a-z0-9؀-ۿ\s']/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var KBN = KB.map(function (e) { return e.k.map(norm); });
  function find(text) {
    var t = ' ' + norm(text) + ' ', best = -1, score = 0;
    KBN.forEach(function (ks, i) {
      var sc = 0;
      ks.forEach(function (k) { if (k && t.indexOf(k) >= 0) sc += Math.min(k.length, 8); });
      if (sc > score) { score = sc; best = i; }
    });
    return score >= 3 ? best : -1;
  }
  window.FaqBotFind = find; window.FaqBotKB = KB;

  var CSS = '#fbBtn{position:fixed;bottom:16px;inset-inline-start:16px;z-index:60;background:#0E3B3C;color:#fff;border:2px solid #D8B565;border-radius:30px;padding:10px 16px;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}' +
    '#fbBox{position:fixed;bottom:70px;inset-inline-start:16px;z-index:61;width:min(360px,calc(100vw - 32px));max-height:70vh;display:none;flex-direction:column;background:#fff;border:1px solid #D8C9A0;border-radius:16px;box-shadow:0 8px 28px rgba(0,0,0,.28);overflow:hidden;color:#222}' +
    '#fbBox header{background:#0E3B3C;color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700}' +
    '#fbBox header button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer}' +
    '#fbLog{padding:12px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.7}' +
    '.fbm{padding:8px 12px;border-radius:12px;max-width:92%}.fbm.b{background:#F3ECDA;align-self:flex-start}.fbm.u{background:#0E3B3C;color:#fff;align-self:flex-end}' +
    '.fbm a{color:#0E3B3C;font-weight:700;display:inline-block;margin-top:4px}' +
    '#fbQs{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}#fbQs button{font:inherit;font-size:12.5px;border:1px solid #D8C9A0;background:#fff;border-radius:16px;padding:5px 10px;cursor:pointer}' +
    '#fbForm{display:flex;gap:6px;padding:8px 12px;border-top:1px solid #eee}#fbForm input{flex:1;min-width:0;font:inherit;border:1px solid #D8C9A0;border-radius:10px;padding:8px}#fbForm button{font:inherit;background:#D8B565;color:#0E3B3C;font-weight:700;border:0;border-radius:10px;padding:8px 12px;cursor:pointer}' +
    '#fbNote{font-size:11px;color:#777;padding:0 12px 8px}';

  function init() {
    if (document.getElementById('fbBtn')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var btn = document.createElement('button'); btn.id = 'fbBtn'; btn.type = 'button'; btn.textContent = UI.btn; btn.className = 'ugc';
    var box = document.createElement('div'); box.id = 'fbBox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', UI.title); box.className = 'ugc';
    box.dir = L === 'ar' ? 'rtl' : 'ltr';
    box.innerHTML = '<header><span></span><button type="button" aria-label="close">✕</button></header><div id="fbLog"></div><div id="fbQs"></div><form id="fbForm"><input maxlength="200" autocomplete="off"><button type="submit"></button></form><div id="fbNote"></div>';
    document.body.appendChild(btn); document.body.appendChild(box);
    box.querySelector('header span').textContent = UI.title;
    var log = box.querySelector('#fbLog'), qs = box.querySelector('#fbQs'), input = box.querySelector('input');
    input.placeholder = UI.ph; box.querySelector('form button').textContent = UI.send; box.querySelector('#fbNote').textContent = UI.note;
    function say(txt, who, link) {
      var m = document.createElement('div'); m.className = 'fbm ' + who; m.textContent = txt;
      if (link) { var a = document.createElement('a'); a.href = link; a.textContent = UI.more + ' ←'; if (L !== 'ar') a.textContent = UI.more + ' →'; m.appendChild(document.createElement('br')); m.appendChild(a); }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
    }
    function answer(i, shownQ) { if (shownQ) say(shownQ, 'u'); if (i < 0) { say(UI.none, 'b'); return; } say(KB[i].a[['ar', 'fr', 'en', 'de'].indexOf(L)], 'b', KB[i].l); }
    var li = ['ar', 'fr', 'en', 'de'].indexOf(L);
    [0, 1, 2, 3, 5, 6, 8, 10].forEach(function (i) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = KB[i].q[li];
      b.onclick = function () { answer(i, KB[i].q[li]); }; qs.appendChild(b);
    });
    var opened = false;
    function toggle(open) { box.style.display = open ? 'flex' : 'none'; if (open && !opened) { opened = true; say(UI.hi, 'b'); } if (open) input.focus(); }
    btn.onclick = function () { toggle(box.style.display !== 'flex'); };
    box.querySelector('header button').onclick = function () { toggle(false); };
    box.querySelector('form').onsubmit = function (e) { e.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = ''; answer(find(v), v.slice(0, 200)); };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
