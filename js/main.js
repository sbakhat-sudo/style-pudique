/* ==========================================================================
   DONNÉES : STOCKAGE LOCAL (LocalStorage simule la base de données)
   Clés utilisées :
     sp_products -> tableau des produits
     sp_orders   -> tableau des commandes
     sp_cart     -> tableau du panier courant
     sp_lang     -> langue d'interface choisie ('fr' ou 'ar')
     sp_reviews  -> tableau des avis clients laissés depuis le site
   ========================================================================== */
const DB_KEYS = { PRODUCTS:'sp_products', ORDERS:'sp_orders', CART:'sp_cart', REVIEWS:'sp_reviews' };

// Numéro WhatsApp de la boutique (format international, sans "+" ni espaces)
const WHATSAPP_NUMBER = '212604170551';

let LANG = localStorage.getItem('sp_lang') || 'fr';

function getProducts(){ return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]'); }
function saveProducts(list){ localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(list)); }
function getStoredReviews(){ return JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]'); }
function saveStoredReviews(list){ localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(list)); }
function getOrders(){ return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]'); }
function saveOrders(list){ localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(list)); }
function getCart(){ return JSON.parse(localStorage.getItem(DB_KEYS.CART) || '[]'); }
function saveCart(list, pulse){ localStorage.setItem(DB_KEYS.CART, JSON.stringify(list)); updateCartBadge(pulse); }

// Données de démonstration injectées au premier chargement uniquement
function seedProductsIfEmpty(){
  if(getProducts().length > 0) return;
  const demo = [
    { name:"Robe Amira", nameAr:"فستان أميرة", category:"Robes", price:79.90, stock:12, featured:true,
      sizes:["S","M","L","XL","Sur mesure"], colors:[["Mauve","#8B5CF6"],["Noir","#1F2937"],["Beige","#D8CAB8"]],
      images:[placeholderImage("Robes"),placeholderImage("Robes")],
      description:"Robe longue fluide en tissu doux, coupe ample et manches longues. Idéale pour un look pudique et raffiné au quotidien.",
      descriptionAr:"فستان طويل وانسيابي من قماش ناعم، بقصة واسعة وأكمام طويلة. مثالي لإطلالة محتشمة وأنيقة في الحياة اليومية." },
    { name:"Abaya Noor", nameAr:"عباية نور", category:"Abayas", price:99.90, stock:8, featured:true,
      sizes:["S","M","L","Sur mesure"], colors:[["Noir","#1F2937"],["Bordeaux","#7F1D1D"]],
      images:[placeholderImage("Abayas"),placeholderImage("Abayas")],
      description:"Abaya classique à coupe droite, tissu premium infroissable, finitions soignées et broderie discrète sur les manches.",
      descriptionAr:"عباية كلاسيكية بقصة مستقيمة، من قماش فاخر لا يتجعد، بتشطيبات أنيقة وتطريز بسيط على الأكمام." },
    { name:"Hijab Soie Douce", nameAr:"حجاب حريري ناعم", category:"Hijabs", price:24.90, stock:30, featured:true,
      sizes:["Taille unique"], colors:[["Mauve","#8B5CF6"],["Blanc","#FFFFFF"],["Beige","#D8CAB8"]],
      images:[placeholderImage("Hijabs"),placeholderImage("Hijabs")],
      description:"Hijab en voile de soie synthétique, léger et opaque, tombé parfait, ne glisse pas.",
      descriptionAr:"حجاب من الحرير الصناعي، خفيف وغير شفاف، بسقوط مثالي وثبات ممتاز دون انزلاق." },
    { name:"Ensemble Léa", nameAr:"طقم ليا", category:"Ensembles", price:129.90, stock:6, featured:true,
      sizes:["S","M","L","XL"], colors:[["Beige","#D8CAB8"],["Noir","#1F2937"]],
      images:[placeholderImage("Ensembles"),placeholderImage("Ensembles")],
      description:"Ensemble deux pièces : tunique longue et pantalon large assorti, parfait pour un style pudique moderne.",
      descriptionAr:"طقم من قطعتين: قميص طويل وسروال واسع متناسق، مثالي لإطلالة محتشمة وعصرية." },
    { name:"Robe Yasmine", nameAr:"فستان ياسمين", category:"Robes", price:89.90, stock:0, featured:false,
      sizes:["M","L"], colors:[["Bordeaux","#7F1D1D"]],
      images:[placeholderImage("Robes")],
      description:"Robe évasée à col rond, tissu texturé, parfaite pour les occasions spéciales.",
      descriptionAr:"فستان بقصة واسعة وياقة دائرية، من قماش ذو ملمس مميز، مثالي للمناسبات الخاصة." },
    { name:"Abaya Chiffon Elégance", nameAr:"عباية شيفون أنيقة", category:"Abayas", price:109.90, stock:15, featured:false,
      sizes:["S","M","L","XL"], colors:[["Mauve","#8B5CF6"],["Noir","#1F2937"]],
      images:[placeholderImage("Abayas"),placeholderImage("Abayas")],
      description:"Abaya en mousseline légère doublée, coupe fluide et élégante, ceinture assortie incluse.",
      descriptionAr:"عباية من الشيفون الخفيف المبطن، بقصة انسيابية وأنيقة، مع حزام متناسق." },
    { name:"Hijab Jersey Confort", nameAr:"حجاب جيرسي مريح", category:"Hijabs", price:19.90, stock:40, featured:false,
      sizes:["Taille unique"], colors:[["Noir","#1F2937"],["Beige","#D8CAB8"],["Mauve","#8B5CF6"]],
      images:[placeholderImage("Hijabs")],
      description:"Hijab en jersey extensible, très confortable, facile à mettre en place, idéal usage quotidien.",
      descriptionAr:"حجاب من قماش الجيرسي المرن، مريح جدًا وسهل التركيب، مثالي للاستخدام اليومي." },
    { name:"Sac Voile Minimaliste", nameAr:"حقيبة أنيقة بسيطة", category:"Accessoires", price:39.90, stock:20, featured:false,
      sizes:["Taille unique"], colors:[["Mauve","#8B5CF6"],["Noir","#1F2937"]],
      images:[placeholderImage("Accessoires")],
      description:"Sac à main minimaliste, ligne épurée, parfait complément pour toute tenue pudique.",
      descriptionAr:"حقيبة يد بتصميم بسيط وأنيق، الإضافة المثالية لأي إطلالة محتشمة." }
  ];
  const products = demo.map((p,i) => ({
    id: 'p' + (Date.now()+i),
    createdAt: Date.now() - (demo.length - i) * 100000,
    ...p
  }));
  saveProducts(products);
}

// Complète les traductions arabes manquantes sur des produits démo déjà enregistrés
// dans le navigateur (sans jamais toucher aux produits renommés ou ajoutés par l'admin)
function migrateDemoTranslations(){
  const AR_NAMES = {
    "Robe Amira":"فستان أميرة", "Abaya Noor":"عباية نور", "Hijab Soie Douce":"حجاب حريري ناعم",
    "Ensemble Léa":"طقم ليا", "Robe Yasmine":"فستان ياسمين", "Abaya Chiffon Elégance":"عباية شيفون أنيقة",
    "Hijab Jersey Confort":"حجاب جيرسي مريح", "Sac Voile Minimaliste":"حقيبة أنيقة بسيطة"
  };
  const products = getProducts();
  let changed = false;
  products.forEach(p => {
    if(!p.nameAr && AR_NAMES[p.name]){ p.nameAr = AR_NAMES[p.name]; changed = true; }
  });
  if(changed) saveProducts(products);
}

/* ==========================================================================
   INTERNATIONALISATION (FR / AR)
   ========================================================================== */
const I18N = {
  fr: {
    pageTitle:"Style-Pudique | Mode pudique & élégante",
    navHome:"Accueil", navCatalogue:"Catalogue", navCart:"Panier", navAdmin:"Espace Admin", navReviews:"Avis",
    heroEyebrow:"✿ Nouvelle collection", heroTitle1:"Là où l'authenticité rencontre", heroTitleHighlight:"l'élégance moderne",
    heroSubtitle:"Découvrez des pièces intemporelles pensées pour la femme moderne, alliant modestie, raffinement et confort au quotidien.",
    heroBtnDiscover:"Découvrir la collection", heroBtnNew:"Voir les nouveautés",
    categoriesTitle:"Nos catégories", categoriesSubtitle:"Trouvez la pièce parfaite pour chaque occasion",
    featuredTitle:"Produits en vedette", featuredSubtitle:"Notre sélection coup de cœur",
    featuredEmpty:"Aucun produit vedette pour le moment.",
    bannerTitle:"Nouvelle Collection ✿", bannerSubtitle:"Des tenues pudiques pensées pour sublimer votre style, dès aujourd'hui.", bannerBtn:"Explorer maintenant",
    badgeAvailable:"Disponible", badgeOutOfStock:"Rupture de stock", viewProduct:"Voir le produit",
    catalogueTitle:"Notre Catalogue", filterCategory:"Catégorie", filterSize:"Taille", filterColor:"Couleur",
    filterPrice:"Prix (DH)", filterMin:"Min", filterMax:"Max", filterReset:"Réinitialiser les filtres",
    sortNewest:"Nouveautés", sortPriceAsc:"Prix croissant", sortPriceDesc:"Prix décroissant",
    catalogueEmpty:"Aucun produit ne correspond à ces filtres.",
    productNotFound:"Produit introuvable.", backToCatalogue:"Retour au catalogue",
    qtyHeading:"Quantité", addToCart:"Ajouter au panier", continueShopping:"Continuer mes achats",
    inStock:"En stock", availableCount:"disponibles",
    cartTitle:"Mon Panier", cartEmpty:"Votre panier est vide.", discoverCatalogue:"Découvrir le catalogue",
    remove:"Supprimer", orderSummary:"Résumé de la commande", subtotal:"Sous-total", shipping:"Livraison",
    free:"Offerte", total:"Total", orderNow:"Commander",
    checkoutPageTitle:"Commande", checkoutHeading:"Finaliser ma commande", customerInfo:"Informations client",
    firstName:"Prénom", lastName:"Nom", emailOptional:"Email (optionnel)", phone:"Téléphone",
    address:"Adresse", city:"Ville", zip:"Code postal", country:"Pays",
    paymentNote:"Aucun paiement en ligne : en confirmant, votre commande est enregistrée et vous êtes redirigée vers WhatsApp pour finaliser l'achat directement avec la boutique.",
    confirmWhatsapp:"Confirmer et envoyer sur WhatsApp", recap:"Récapitulatif",
    thanksTitle:"Merci pour votre commande ! 🙏",
    thanksMessage:"Votre commande a bien été reçue sur WhatsApp. Merci de patienter pendant que notre équipe la confirme, nous vous répondrons très rapidement.",
    openWhatsapp:"Ouvrir WhatsApp",
    trustTitle:"Ce que disent nos clientes",
    reviewsPageTitle:"Avis de nos clientes", reviewFormTitle:"Laisser un avis",
    reviewNameLabel:"Votre nom", reviewRatingLabel:"Votre note", reviewTextLabel:"Votre avis",
    reviewSubmitBtn:"Envoyer mon avis", reviewsSeeAll:"Voir tous les avis",
    alertNeedReview:"Veuillez indiquer votre nom, une note et votre avis.",
    toastReviewAdded:"Merci pour votre avis ! ✓",
    orderStatusPending:"En attente de confirmation", orderStatusConfirmed:"Confirmée ✅",
    adminConfirmOrderBtn:"Confirmer & prévenir sur WhatsApp",
    waConfirmedGreeting:"Parfait ! ✅ Votre commande {id} est CONFIRMÉE.",
    waConfirmedBody:"Merci pour votre confiance, nous la préparons dès maintenant pour vous. 🌸",
    adminLoginSubtitle:"Connectez-vous pour gérer la boutique Style-Pudique",
    username:"Identifiant", password:"Mot de passe", loginBtn:"Se connecter", loginError:"Identifiants incorrects.",
    demoCreds:"Identifiants de démonstration :",
    dashboardTitle:"Tableau de bord", logout:"Se déconnecter",
    productsLabel:"Produits", outOfStockLabel:"Ruptures de stock", ordersLabel:"Commandes", revenueLabel:"Chiffre d'affaires",
    addProductBtn:"+ Ajouter un produit", editBtn:"Modifier", stockLabel:"Stock : ",
    noProducts:"Aucun produit. Ajoutez-en un pour commencer.",
    orderNumber:"N° Commande", customerLabel:"Client", articlesLabel:"Articles", dateLabel:"Date",
    statusLabel:"Statut", toastOrderConfirmed:"Commande confirmée ✓",
    noOrders:"Aucune commande pour le moment.",
    modalAddTitle:"Ajouter un produit", modalEditTitle:"Modifier le produit",
    fieldNameFr:"Nom du produit (Français)", fieldNameAr:"Nom du produit (Arabe – optionnel)",
    fieldDescFr:"Description (Français)", fieldDescAr:"Description (Arabe – optionnel)",
    fieldPrice:"Prix (DH)", fieldStock:"Stock", fieldCategory:"Catégorie",
    fieldSizes:"Tailles disponibles", fieldColors:"Couleurs disponibles",
    fieldFeatured:"Mise en avant (page d'accueil)", featuredCheckboxLabel:"Produit vedette",
    fieldImages:"Images du produit", saveProductBtn:"Enregistrer le produit",
    alertNeedImage:"Veuillez ajouter au moins une image du produit.",
    alertNeedSizeColor:"Veuillez sélectionner au moins une taille et une couleur.",
    toastProductUpdated:"Produit mis à jour ✓", toastProductAdded:"Produit ajouté ✓",
    confirmDeleteProduct:"Supprimer définitivement ce produit ?", toastProductDeleted:"Produit supprimé",
    toastAddedToCart:"Produit ajouté au panier ✓",
    footerTagline:"Mode pudique, élégante et intemporelle, pensée pour la femme moderne.",
    footerNavTitle:"Navigation", footerServiceTitle:"Service Client", footerContactTitle:"Contact",
    footerRights:"© 2026 Style-Pudique — Tous droits réservés",
    waTitle:"Nouvelle commande Style-Pudique 🌸", waOrderNumber:"N° commande", waItems:"Articles",
    waTotal:"Total", waCustomer:"Client", waPhone:"Téléphone", waAddress:"Adresse", waEmail:"Email",
    waSize:"Taille", waColor:"Couleur", waMeasurements:"Mesures",
    measurementsTitle:"Vos mesures (cm)", measHeight:"Hauteur", measBust:"Tour de poitrine",
    measWaist:"Tour de taille", measHips:"Tour de hanches",
    measHint:"Indiquez vos mesures pour une coupe sur mesure.",
    alertNeedMeasurements:"Veuillez indiquer toutes vos mesures pour une taille sur mesure."
  },
  ar: {
    pageTitle:"ستايل بوديك | أزياء محتشمة وأنيقة",
    navHome:"الرئيسية", navCatalogue:"الكتالوج", navCart:"السلة", navAdmin:"لوحة التحكم", navReviews:"التقييمات",
    heroEyebrow:"✿ تشكيلة جديدة", heroTitle1:"حيث تلتقي الأصالة", heroTitleHighlight:"بالأناقة العصرية",
    heroSubtitle:"اكتشفي تشكيلة من القطع الأنيقة والخالدة، صُممت خصيصًا للمرأة العصرية التي تجمع بين الحشمة والرقي والراحة في حياتها اليومية.",
    heroBtnDiscover:"اكتشفي المجموعة", heroBtnNew:"شاهدي الجديد",
    categoriesTitle:"فئاتنا", categoriesSubtitle:"اعثري على القطعة المثالية لكل مناسبة",
    featuredTitle:"منتجات مميزة", featuredSubtitle:"مختاراتنا المفضلة",
    featuredEmpty:"لا توجد منتجات مميزة حاليًا.",
    bannerTitle:"تشكيلة جديدة ✿", bannerSubtitle:"إطلالات محتشمة صُممت لإبراز أناقتك، ابتداءً من اليوم.", bannerBtn:"اكتشفي الآن",
    badgeAvailable:"متوفر", badgeOutOfStock:"نفدت الكمية", viewProduct:"عرض المنتج",
    catalogueTitle:"كتالوجنا", filterCategory:"الفئة", filterSize:"المقاس", filterColor:"اللون",
    filterPrice:"السعر (درهم)", filterMin:"الأدنى", filterMax:"الأقصى", filterReset:"إعادة تعيين الفلاتر",
    sortNewest:"الأحدث", sortPriceAsc:"السعر: تصاعدي", sortPriceDesc:"السعر: تنازلي",
    catalogueEmpty:"لا يوجد منتج يطابق هذه الفلاتر.",
    productNotFound:"المنتج غير موجود.", backToCatalogue:"العودة إلى الكتالوج",
    qtyHeading:"الكمية", addToCart:"أضف إلى السلة", continueShopping:"متابعة التسوق",
    inStock:"متوفر", availableCount:"قطعة متبقية",
    cartTitle:"سلتي", cartEmpty:"سلتك فارغة.", discoverCatalogue:"تصفح الكتالوج",
    remove:"حذف", orderSummary:"ملخص الطلب", subtotal:"المجموع الفرعي", shipping:"التوصيل",
    free:"مجاني", total:"المجموع", orderNow:"اطلبي الآن",
    checkoutPageTitle:"الطلب", checkoutHeading:"إتمام الطلب", customerInfo:"معلومات العميلة",
    firstName:"الاسم الشخصي", lastName:"اسم العائلة", emailOptional:"البريد الإلكتروني (اختياري)", phone:"الهاتف",
    address:"العنوان", city:"المدينة", zip:"الرمز البريدي", country:"البلد",
    paymentNote:"لا يوجد دفع إلكتروني: عند التأكيد، يتم تسجيل طلبك وتحويلك إلى واتساب لإتمام الشراء مباشرة مع المتجر.",
    confirmWhatsapp:"تأكيد الطلب عبر واتساب", recap:"ملخص الطلب",
    thanksTitle:"شكرًا لطلبك! 🙏",
    thanksMessage:"تم استلام طلبك عبر واتساب. يرجى الانتظار حتى يقوم فريقنا بتأكيده، سنرد عليك في أقرب وقت ممكن.",
    openWhatsapp:"فتح واتساب",
    trustTitle:"ماذا تقول عميلاتنا",
    reviewsPageTitle:"آراء عميلاتنا", reviewFormTitle:"أضيفي تقييمك",
    reviewNameLabel:"اسمك", reviewRatingLabel:"تقييمك", reviewTextLabel:"رأيك",
    reviewSubmitBtn:"إرسال التقييم", reviewsSeeAll:"عرض جميع التقييمات",
    alertNeedReview:"يرجى إدخال اسمك وتقييمك ورأيك.",
    toastReviewAdded:"شكرًا لتقييمك! ✓",
    orderStatusPending:"بانتظار التأكيد", orderStatusConfirmed:"مؤكد ✅",
    adminConfirmOrderBtn:"تأكيد الطلب وإخطار العميلة عبر واتساب",
    waConfirmedGreeting:"ممتاز! ✅ تم تأكيد طلبك رقم {id}.",
    waConfirmedBody:"شكرًا لثقتك، نحن بصدد تحضيره لك الآن. 🌸",
    adminLoginSubtitle:"سجلي الدخول لإدارة متجر Style-Pudique",
    username:"اسم المستخدم", password:"كلمة المرور", loginBtn:"تسجيل الدخول", loginError:"بيانات الدخول غير صحيحة.",
    demoCreds:"بيانات تجريبية:",
    dashboardTitle:"لوحة القيادة", logout:"تسجيل الخروج",
    productsLabel:"المنتجات", outOfStockLabel:"نفاد المخزون", ordersLabel:"الطلبات", revenueLabel:"رقم الأعمال",
    addProductBtn:"+ إضافة منتج", editBtn:"تعديل", stockLabel:"المخزون: ",
    noProducts:"لا يوجد منتج. أضيفي واحدًا للبدء.",
    orderNumber:"رقم الطلب", customerLabel:"العميلة", articlesLabel:"المنتجات", dateLabel:"التاريخ",
    statusLabel:"الحالة", toastOrderConfirmed:"تم تأكيد الطلب ✓",
    noOrders:"لا توجد طلبات حاليًا.",
    modalAddTitle:"إضافة منتج", modalEditTitle:"تعديل المنتج",
    fieldNameFr:"اسم المنتج (بالفرنسية)", fieldNameAr:"اسم المنتج (بالعربية – اختياري)",
    fieldDescFr:"الوصف (بالفرنسية)", fieldDescAr:"الوصف (بالعربية – اختياري)",
    fieldPrice:"السعر (درهم)", fieldStock:"المخزون", fieldCategory:"الفئة",
    fieldSizes:"المقاسات المتوفرة", fieldColors:"الألوان المتوفرة",
    fieldFeatured:"إبراز في الصفحة الرئيسية", featuredCheckboxLabel:"منتج مميز",
    fieldImages:"صور المنتج", saveProductBtn:"حفظ المنتج",
    alertNeedImage:"يرجى إضافة صورة واحدة على الأقل للمنتج.",
    alertNeedSizeColor:"يرجى اختيار مقاس ولون واحد على الأقل.",
    toastProductUpdated:"تم تحديث المنتج ✓", toastProductAdded:"تم إضافة المنتج ✓",
    confirmDeleteProduct:"هل تريدين حذف هذا المنتج نهائيًا؟", toastProductDeleted:"تم حذف المنتج",
    toastAddedToCart:"تمت إضافة المنتج إلى السلة ✓",
    footerTagline:"أزياء محتشمة، أنيقة وخالدة، صُممت للمرأة العصرية.",
    footerNavTitle:"روابط", footerServiceTitle:"خدمة العملاء", footerContactTitle:"تواصل معنا",
    footerRights:"© 2026 Style-Pudique — جميع الحقوق محفوظة",
    waTitle:"طلب جديد من Style-Pudique 🌸", waOrderNumber:"رقم الطلب", waItems:"المنتجات",
    waTotal:"المجموع", waCustomer:"الزبونة", waPhone:"الهاتف", waAddress:"العنوان", waEmail:"البريد الإلكتروني",
    waSize:"المقاس", waColor:"اللون", waMeasurements:"المقاسات",
    measurementsTitle:"مقاساتك (سم)", measHeight:"الطول", measBust:"محيط الصدر",
    measWaist:"محيط الخصر", measHips:"محيط الورك",
    measHint:"أدخلي مقاساتك للحصول على قصة مخصصة.",
    alertNeedMeasurements:"يرجى إدخال جميع مقاساتك للمقاس المخصص."
  }
};

const CATEGORY_LABELS = {
  fr:{Robes:'Robes',Abayas:'Abayas',Hijabs:'Hijabs',Ensembles:'Ensembles',Accessoires:'Accessoires'},
  ar:{Robes:'فساتين',Abayas:'عبايات',Hijabs:'حجابات',Ensembles:'أطقم',Accessoires:'إكسسوارات'}
};
const COLOR_LABELS = {
  fr:{Mauve:'Mauve',Noir:'Noir',Beige:'Beige',Blanc:'Blanc',Bordeaux:'Bordeaux',Gris:'Gris',Marine:'Marine',
      Kaki:'Kaki',Rose:'Rose',Vert:'Vert',Bleu:'Bleu',Camel:'Camel',Taupe:'Taupe',Rouge:'Rouge',
      'Doré':'Doré',Jaune:'Jaune',Turquoise:'Turquoise',Prune:'Prune'},
  ar:{Mauve:'موف',Noir:'أسود',Beige:'بيج',Blanc:'أبيض',Bordeaux:'عنابي',Gris:'رمادي',Marine:'كحلي',
      Kaki:'كاكي',Rose:'وردي',Vert:'أخضر',Bleu:'أزرق',Camel:'جملي',Taupe:'بني رمادي',Rouge:'أحمر',
      'Doré':'ذهبي',Jaune:'أصفر',Turquoise:'فيروزي',Prune:'نبيتي'}
};
const SIZE_LABELS = {
  fr:{'Taille unique':'Taille unique', 'Sur mesure':'Sur mesure'},
  ar:{'Taille unique':'مقاس واحد', 'Sur mesure':'مقاس مخصص'}
};

function t(key){ return (I18N[LANG] && I18N[LANG][key]) || I18N.fr[key] || key; }
function catLabel(cat){ return (CATEGORY_LABELS[LANG] && CATEGORY_LABELS[LANG][cat]) || cat; }
function colorLabel(name){ return (COLOR_LABELS[LANG] && COLOR_LABELS[LANG][name]) || name; }
function sizeLabel(s){ return (SIZE_LABELS[LANG] && SIZE_LABELS[LANG][s]) || s; }
function prodName(p){ return (LANG === 'ar' && p.nameAr) ? p.nameAr : p.name; }
function prodDesc(p){ return (LANG === 'ar' && p.descriptionAr) ? p.descriptionAr : p.description; }
function measurementsText(m){
  if(!m) return '';
  return `${t('measHeight')} ${m.height}cm · ${t('measBust')} ${m.bust}cm · ${t('measWaist')} ${m.waist}cm · ${t('measHips')} ${m.hips}cm`;
}

// Avis clients d'exemple à remplacer par de vrais retours dès que la boutique en aura reçu.
const REVIEWS = {
  fr: [
    { stars:5, text:"Service excellent, livraison rapide et qualité au rendez-vous.", author:"Fatima Z." },
    { stars:5, text:"Très professionnelles, mon abaya sur mesure était parfaite.", author:"Sara B." },
    { stars:5, text:"Réponse rapide sur WhatsApp, je recommande vivement cette boutique.", author:"Imane K." }
  ],
  ar: [
    { stars:5, text:"خدمة ممتازة وتوصيل سريع وجودة عالية.", author:"فاطمة ز." },
    { stars:5, text:"احترافية عالية، العباية المفصلة على المقاس كانت مثالية.", author:"سارة ب." },
    { stars:5, text:"رد سريع جدًا على واتساب، أنصح بهذا المتجر بشدة.", author:"إيمان ك." }
  ]
};
// Combine les avis d'exemple (traduits) avec les vrais avis envoyés par les clientes,
// affichés publiquement : uniquement 4 étoiles et plus, les plus récents d'abord.
// (Tous les avis restent toutefois enregistrés dans sp_reviews, y compris les moins bons.)
function allReviews(){
  const stored = getStoredReviews()
    .filter(r => r.stars >= 4)
    .sort((a,b) => new Date(b.date) - new Date(a.date));
  const examples = REVIEWS[LANG] || REVIEWS.fr;
  return [...stored, ...examples];
}
function trustSectionHtml(limit){
  const full = allReviews();
  const reviews = limit ? full.slice(0, limit) : full;
  return `
  <div class="trust-section">
    <h3>${t('trustTitle')}</h3>
    <div class="trust-grid">
      ${reviews.map(r => `
        <div class="trust-card">
          <div class="trust-stars">${'⭐'.repeat(r.stars)}</div>
          <p>${escapeHtml(r.text)}</p>
          <span class="trust-author">— ${escapeHtml(r.author)}</span>
        </div>
      `).join('')}
    </div>
    ${limit && full.length > limit ? `<a href="#/avis" class="btn btn-outline" style="margin-top:22px;">${t('reviewsSeeAll')}</a>` : ''}
  </div>`;
}

/* ==========================================================================
   PAGE : AVIS CLIENTS
   ========================================================================== */
let reviewStarsSelected = 0;
function renderReviewsPage(){
  return `
  <div class="container" style="padding:20px 0 70px;">
    <div class="page-head">
      <div class="crumbs"><a href="#/">${t('navHome')}</a> / ${t('navReviews')}</div>
      <h1>${t('reviewsPageTitle')}</h1>
    </div>
    ${trustSectionHtml()}
    <div class="card-white review-form-card">
      <h3>${t('reviewFormTitle')}</h3>
      <form id="review-form" onsubmit="return handleReviewSubmit(event)">
        <div class="form-group">
          <label>${t('reviewNameLabel')}</label>
          <input type="text" id="review-name" required>
        </div>
        <div class="form-group">
          <label>${t('reviewRatingLabel')}</label>
          <div class="star-picker" id="review-star-picker">
            ${[1,2,3,4,5].map(n => `<button type="button" class="star-btn" data-value="${n}" onclick="setReviewStars(${n})">★</button>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label>${t('reviewTextLabel')}</label>
          <textarea id="review-text" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${t('reviewSubmitBtn')}</button>
      </form>
    </div>
  </div>
  `;
}
function attachReviewsPageEvents(){
  reviewStarsSelected = 0;
  document.querySelectorAll('#review-star-picker .star-btn').forEach(b => b.classList.remove('filled'));
}
function setReviewStars(n){
  reviewStarsSelected = n;
  document.querySelectorAll('#review-star-picker .star-btn').forEach(b => {
    b.classList.toggle('filled', parseInt(b.dataset.value) <= n);
  });
}
function handleReviewSubmit(e){
  e.preventDefault();
  const name = document.getElementById('review-name').value.trim();
  const text = document.getElementById('review-text').value.trim();
  if(!name || !text || reviewStarsSelected < 1){
    alert(t('alertNeedReview'));
    return false;
  }
  const reviews = getStoredReviews();
  reviews.push({ id:'r'+Date.now(), author:name, stars:reviewStarsSelected, text, date:new Date().toISOString() });
  saveStoredReviews(reviews);
  showToast(t('toastReviewAdded'));
  document.getElementById('app').innerHTML = renderReviewsPage();
  attachReviewsPageEvents();
  return false;
}

function applyStaticTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-cat]').forEach(el => { el.textContent = catLabel(el.dataset.cat); });
  document.querySelectorAll('[data-size-label]').forEach(el => { el.textContent = sizeLabel(el.dataset.sizeLabel); });
  document.querySelectorAll('[data-color-label]').forEach(el => { el.textContent = colorLabel(el.dataset.colorLabel); });
}
function applyLangToDocument(){
  document.documentElement.setAttribute('lang', LANG);
  document.documentElement.setAttribute('dir', LANG === 'ar' ? 'rtl' : 'ltr');
  document.title = t('pageTitle');
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));
  applyStaticTranslations();
}
function setLang(lang){
  if(lang === LANG) return;
  LANG = lang;
  localStorage.setItem('sp_lang', lang);
  applyLangToDocument();
  renderRoute();
}

/* ==========================================================================
   UTILITAIRES
   ========================================================================== */
// Visuels de substitution dessinés en SVG (aucune requête réseau, donc jamais
// d'image cassée) en attendant que la boutique mette en ligne ses vraies photos :
// dégradé de marque + motif floral en filigrane + icône minimaliste centrée.
const CATEGORY_TONES = {
  Robes:       ['#C4B5FD', '#7C3AED'],
  Abayas:      ['#A78BFA', '#5B21B6'],
  Hijabs:      ['#DDD6FE', '#8B5CF6'],
  Ensembles:   ['#A78BFA', '#6D28D9'],
  Accessoires: ['#C4B5FD', '#6D28D9']
};
const HANGER_ICON = `<circle cx="50" cy="37" r="3.4" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M50 40.4 L50 48" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M50 48 L25 66 Q20 69.5 25 72 L75 72 Q80 69.5 75 66 Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 72 L38 78 M62 72 L62 78" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>`;
const BAG_ICON = `<path d="M37 51 Q37 38 50 38 Q63 38 63 51" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><rect x="30" y="51" width="40" height="32" rx="6" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M30 62 L70 62" stroke="#fff" stroke-width="1.4" stroke-opacity="0.65"/>`;
const CATEGORY_ICONS = {
  Robes: HANGER_ICON, Abayas: HANGER_ICON, Hijabs: HANGER_ICON, Ensembles: HANGER_ICON,
  Accessoires: BAG_ICON
};
const PETAL_WATERMARK = [0,72,144,216,288].map(a =>
  `<path d="M0 0 Q7 -17 0 -32 Q-7 -17 0 0 Z" fill="#fff" transform="rotate(${a})"/>`
).join('');
function placeholderImage(category){
  const [light, dark] = CATEGORY_TONES[category] || CATEGORY_TONES.Robes;
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Robes;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">`
    + `<defs>`
    + `<linearGradient id="bg" x1="0" y1="0" x2="100" y2="120"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`
    + `<radialGradient id="glow" cx="26%" cy="14%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity="0.32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`
    + `</defs>`
    + `<rect width="100" height="120" fill="url(#bg)"/>`
    + `<rect width="100" height="120" fill="url(#glow)"/>`
    + `<g opacity="0.16" transform="translate(83,17) rotate(15) scale(1.7)">${PETAL_WATERMARK}</g>`
    + `<rect x="6" y="6" width="88" height="108" rx="2" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="0.6"/>`
    + `<circle cx="50" cy="63" r="28" fill="#fff" fill-opacity="0.12"/>`
    + icon
    + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
function formatPrice(n){
  const val = LANG === 'ar' ? n.toFixed(2) : n.toFixed(2).replace('.', ',');
  const currency = LANG === 'ar' ? 'درهم' : 'DH';
  return `${val} ${currency}`;
}
function escapeHtml(str){
  const div = document.createElement('div'); div.textContent = str ?? ''; return div.innerHTML;
}
function showToast(msg){
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(()=>el.remove(), 300); }, 2400);
}
function navigate(hash){ window.location.hash = hash; }

/* ==========================================================================
   PANIER
   ========================================================================== */
function cartCount(){ return getCart().reduce((sum,i) => sum + i.qty, 0); }
function updateCartBadge(pulse){
  const el = document.getElementById('cart-count');
  if(!el) return;
  el.textContent = cartCount();
  if(pulse){
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  }
}
function addToCart(productId, size, color, qty, measurements){
  const cart = getCart();
  // Une ligne "Sur mesure" est toujours distincte (mesures propres à chaque commande)
  const existing = !measurements && cart.find(i => i.productId === productId && i.size === size && i.color === color && !i.measurements);
  if(existing){ existing.qty += qty; } else { cart.push({ productId, size, color, qty, measurements: measurements || null }); }
  saveCart(cart, true);
  showToast(t('toastAddedToCart'));
}
function removeCartLine(index){
  const cart = getCart();
  cart.splice(index,1);
  saveCart(cart);
  renderRoute();
}
function updateCartQty(index, qty){
  const cart = getCart();
  if(qty < 1) qty = 1;
  cart[index].qty = qty;
  saveCart(cart);
  renderRoute();
}
function cartLinesWithProducts(){
  const products = getProducts();
  return getCart().map((line, idx) => {
    const product = products.find(p => p.id === line.productId);
    return { ...line, index: idx, product };
  }).filter(l => l.product);
}
function cartTotal(){
  return cartLinesWithProducts().reduce((sum,l) => sum + l.product.price * l.qty, 0);
}

/* ==========================================================================
   ROUTEUR
   ========================================================================== */
function parseHash(){
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);
  return parts;
}
function renderRoute(){
  const parts = parseHash();
  const app = document.getElementById('app');
  window.scrollTo(0,0);
  setActiveNav(parts);

  if(parts.length === 0){ app.innerHTML = renderHome(); attachHomeEvents(); }
  else if(parts[0] === 'catalogue'){ app.innerHTML = renderCatalogue(); attachCatalogueEvents(); }
  else if(parts[0] === 'produit' && parts[1]){ app.innerHTML = renderProductDetail(parts[1]); attachProductDetailEvents(parts[1]); }
  else if(parts[0] === 'panier'){ app.innerHTML = renderCartPage(); }
  else if(parts[0] === 'checkout'){ app.innerHTML = renderCheckoutPage(); attachCheckoutEvents(); }
  else if(parts[0] === 'avis'){ app.innerHTML = renderReviewsPage(); attachReviewsPageEvents(); }
  else if(parts[0] === 'admin'){ renderAdminRoute(app); }
  else { app.innerHTML = renderHome(); attachHomeEvents(); }

  document.getElementById('mobile-menu').classList.remove('open');

  // Petite transition d'entrée de page + révélation au scroll des blocs .reveal-up
  app.classList.remove('page-fade');
  void app.offsetWidth;
  app.classList.add('page-fade');
  initScrollReveal();
}

// Fait apparaître en douceur les blocs marqués .reveal-up quand ils entrent dans le viewport
// (respecte prefers-reduced-motion : tout est affiché directement dans ce cas)
let scrollRevealObserver = null;
function initScrollReveal(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal-up:not(.in-view)');
  if(reduced){ els.forEach(el => el.classList.add('in-view')); return; }
  if(!scrollRevealObserver){
    scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  els.forEach(el => scrollRevealObserver.observe(el));
}
function setActiveNav(parts){
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const route = parts.length === 0 ? '/' : '/' + parts[0];
  const link = document.querySelector(`.nav-links a[data-route="${route}"]`);
  if(link) link.classList.add('active');
}

/* ==========================================================================
   PAGE : ACCUEIL
   ========================================================================== */
function renderHome(){
  const products = getProducts();
  const featured = products.filter(p => p.featured).slice(0,4);
  const categories = ['Robes', 'Abayas', 'Hijabs', 'Ensembles'];

  return `
  <section class="hero fade-in">
    <div class="hero-inner">
      <span class="hero-eyebrow">${t('heroEyebrow')}</span>
      <h1>${t('heroTitle1')} <span>${t('heroTitleHighlight')}</span></h1>
      <p>${t('heroSubtitle')}</p>
      <div class="hero-actions">
        <a href="#/catalogue" class="btn btn-primary">${t('heroBtnDiscover')}</a>
        <a href="#/catalogue" class="btn btn-outline">${t('heroBtnNew')}</a>
      </div>
    </div>
  </section>

  <section class="section container reveal-up">
    <h2 class="section-title">${t('categoriesTitle')}</h2>
    <p class="section-subtitle">${t('categoriesSubtitle')}</p>
    <div class="cat-grid">
      ${categories.map((cat, i) => `
        <div class="cat-card" style="transition-delay:${i*70}ms" onclick="navigate('#/catalogue'); setTimeout(()=>filterByCategory('${cat}'),0)">
          <img src="${placeholderImage(cat)}" alt="${escapeHtml(catLabel(cat))}">
          <div class="cat-overlay"><span>${escapeHtml(catLabel(cat))}</span></div>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="section container reveal-up" style="padding-top:0;">
    <h2 class="section-title">${t('featuredTitle')}</h2>
    <p class="section-subtitle">${t('featuredSubtitle')}</p>
    ${featured.length ? `<div class="prod-grid">${featured.map(productCardHtml).join('')}</div>` : `<p class="empty-state">${t('featuredEmpty')}</p>`}
  </section>

  <section class="container reveal-up" style="padding-top:0;padding-bottom:16px;">
    ${trustSectionHtml(3)}
  </section>

  <section class="container reveal-up" style="padding-bottom:70px;">
    <div class="collection-banner">
      <h2>${t('bannerTitle')}</h2>
      <p>${t('bannerSubtitle')}</p>
      <a href="#/catalogue" class="btn btn-primary">${t('bannerBtn')}</a>
    </div>
  </section>
  `;
}
function attachHomeEvents(){}
function filterByCategory(cat){
  const sel = document.querySelector(`#filter-category input[value="${cat}"]`);
  if(sel){ sel.checked = true; sel.dispatchEvent(new Event('change')); }
}

function productCardHtml(p){
  const outOfStock = p.stock <= 0;
  return `
  <div class="prod-card fade-in">
    <a href="#/produit/${p.id}">
      <div class="prod-img-wrap">
        <img src="${p.images[0]}" alt="${escapeHtml(prodName(p))}">
        ${outOfStock ? '' : `<span class="badge badge-purple prod-badge-new">${t('badgeAvailable')}</span>`}
      </div>
    </a>
    <div class="prod-info">
      <span class="prod-cat">${escapeHtml(catLabel(p.category))}</span>
      <a href="#/produit/${p.id}"><span class="prod-name">${escapeHtml(prodName(p))}</span></a>
      <span class="prod-price">${formatPrice(p.price)}</span>
      ${outOfStock ? `<span class="prod-stock-out">${t('badgeOutOfStock')}</span>` : ''}
      <a href="#/produit/${p.id}" class="btn btn-outline btn-sm prod-link-btn">${t('viewProduct')}</a>
    </div>
  </div>`;
}

/* ==========================================================================
   PAGE : CATALOGUE
   ========================================================================== */
let catalogueFilters = { categories:[], sizes:[], colors:[], min:'', max:'', sort:'newest' };

function resultCountText(n){
  if(LANG === 'ar') return `${n} ${n > 1 ? 'منتجات' : 'منتج'}`;
  return `${n} produit${n>1?'s':''}`;
}

function renderCatalogue(){
  const products = getProducts();
  const allCategories = [...new Set(products.map(p => p.category))];
  const allSizes = [...new Set(products.flatMap(p => p.sizes))];
  const allColors = [...new Map(products.flatMap(p => p.colors).map(c => [c[0], c])).values()];

  return `
  <div class="container">
    <div class="page-head">
      <div class="crumbs"><a href="#/">${t('navHome')}</a> / ${t('navCatalogue')}</div>
      <h1>${t('catalogueTitle')}</h1>
    </div>

    <div class="catalogue-layout reveal-up">
      <aside class="filters-panel card-white">
        <div class="filter-group" id="filter-category">
          <h4>${t('filterCategory')}</h4>
          ${allCategories.map(c => `
            <label class="filter-check">
              <input type="checkbox" value="${escapeHtml(c)}" onchange="toggleFilter('categories','${escapeHtml(c)}')">
              ${escapeHtml(catLabel(c))}
            </label>`).join('')}
        </div>
        <div class="filter-group" id="filter-size">
          <h4>${t('filterSize')}</h4>
          ${allSizes.map(s => `
            <label class="filter-check">
              <input type="checkbox" value="${escapeHtml(s)}" onchange="toggleFilter('sizes','${escapeHtml(s)}')">
              ${escapeHtml(sizeLabel(s))}
            </label>`).join('')}
        </div>
        <div class="filter-group">
          <h4>${t('filterColor')}</h4>
          <div class="color-swatch-list" id="filter-color">
            ${allColors.map(c => `
              <div class="color-swatch" style="background:${c[1]};box-shadow:0 0 0 1px var(--border) inset;" title="${escapeHtml(colorLabel(c[0]))}" onclick="toggleColorFilter(this,'${escapeHtml(c[0])}')"></div>
            `).join('')}
          </div>
        </div>
        <div class="filter-group">
          <h4>${t('filterPrice')}</h4>
          <div class="price-range-inputs">
            <input type="number" id="filter-min" placeholder="${t('filterMin')}" oninput="setPriceFilter()">
            <span>-</span>
            <input type="number" id="filter-max" placeholder="${t('filterMax')}" oninput="setPriceFilter()">
          </div>
        </div>
        <a class="filter-reset" onclick="resetFilters()">${t('filterReset')}</a>
      </aside>

      <div class="catalogue-main">
        <div class="catalogue-toolbar">
          <span class="result-count" id="result-count"></span>
          <select id="sort-select" onchange="setSortOrder(this.value)">
            <option value="newest">${t('sortNewest')}</option>
            <option value="price-asc">${t('sortPriceAsc')}</option>
            <option value="price-desc">${t('sortPriceDesc')}</option>
          </select>
        </div>
        <div class="prod-grid" id="catalogue-grid"></div>
      </div>
    </div>
  </div>
  `;
}

function attachCatalogueEvents(){ renderFilteredProducts(); }

function toggleFilter(kind, value){
  const arr = catalogueFilters[kind];
  const i = arr.indexOf(value);
  if(i === -1) arr.push(value); else arr.splice(i,1);
  renderFilteredProducts();
}
function toggleColorFilter(el, colorName){
  el.classList.toggle('active');
  toggleFilter('colors', colorName);
}
function setPriceFilter(){
  catalogueFilters.min = document.getElementById('filter-min').value;
  catalogueFilters.max = document.getElementById('filter-max').value;
  renderFilteredProducts();
}
function setSortOrder(val){ catalogueFilters.sort = val; renderFilteredProducts(); }
function resetFilters(){
  catalogueFilters = { categories:[], sizes:[], colors:[], min:'', max:'', sort:'newest' };
  document.getElementById('catalogue-grid').closest('.catalogue-main').parentElement.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
  document.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('active'));
  document.getElementById('filter-min').value='';
  document.getElementById('filter-max').value='';
  document.getElementById('sort-select').value='newest';
  renderFilteredProducts();
}
function renderFilteredProducts(){
  let list = getProducts();
  const f = catalogueFilters;
  if(f.categories.length) list = list.filter(p => f.categories.includes(p.category));
  if(f.sizes.length) list = list.filter(p => p.sizes.some(s => f.sizes.includes(s)));
  if(f.colors.length) list = list.filter(p => p.colors.some(c => f.colors.includes(c[0])));
  if(f.min !== '') list = list.filter(p => p.price >= parseFloat(f.min));
  if(f.max !== '') list = list.filter(p => p.price <= parseFloat(f.max));

  if(f.sort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if(f.sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else list.sort((a,b) => b.createdAt - a.createdAt);

  const grid = document.getElementById('catalogue-grid');
  const countEl = document.getElementById('result-count');
  if(countEl) countEl.textContent = resultCountText(list.length);
  if(grid) grid.innerHTML = list.length ? list.map(productCardHtml).join('') : `<p class="empty-state">${t('catalogueEmpty')}</p>`;
}

/* ==========================================================================
   PAGE : FICHE PRODUIT
   ========================================================================== */
let pdSelectedSize = null, pdSelectedColor = null, pdMainImage = null;

function renderProductDetail(id){
  const product = getProducts().find(p => p.id === id);
  if(!product){
    return `<div class="container"><p class="empty-state">${t('productNotFound')} <a href="#/catalogue">${t('backToCatalogue')}</a></p></div>`;
  }
  pdSelectedSize = product.sizes[0] || null;
  pdSelectedColor = product.colors[0] ? product.colors[0][0] : null;
  pdMainImage = 0;
  const outOfStock = product.stock <= 0;

  return `
  <div class="container">
    <div class="page-head">
      <div class="crumbs"><a href="#/">${t('navHome')}</a> / <a href="#/catalogue">${t('navCatalogue')}</a> / ${escapeHtml(prodName(product))}</div>
    </div>
    <div class="product-detail reveal-up">
      <div>
        <div class="gallery-main"><img id="pd-main-img" src="${product.images[0]}" alt="${escapeHtml(prodName(product))}"></div>
        <div class="gallery-thumbs">
          ${product.images.map((img,i) => `<img src="${img}" class="${i===0?'active':''}" onclick="switchGalleryImage(${i}, this)">`).join('')}
        </div>
      </div>
      <div>
        <span class="pd-cat">${escapeHtml(catLabel(product.category))}</span>
        <h1 class="pd-name">${escapeHtml(prodName(product))}</h1>
        <div class="pd-price">${formatPrice(product.price)}</div>
        <p class="pd-desc">${escapeHtml(prodDesc(product))}</p>

        <div class="option-block">
          <h4>${t('filterSize')}</h4>
          <div class="size-options" id="pd-sizes">
            ${product.sizes.map(s => `<div class="size-opt ${s===pdSelectedSize?'active':''}" onclick="selectSize('${escapeHtml(s)}', this)">${escapeHtml(sizeLabel(s))}</div>`).join('')}
          </div>
          <div class="measurements-panel" id="pd-measurements" ${pdSelectedSize === 'Sur mesure' ? '' : 'hidden'}>
            <h5>${t('measurementsTitle')}</h5>
            <p class="field-hint" style="margin-bottom:12px;">${t('measHint')}</p>
            <div class="measurements-grid">
              <div class="form-group"><label>${t('measHeight')}</label><input type="number" id="meas-height" min="1" step="0.1"></div>
              <div class="form-group"><label>${t('measBust')}</label><input type="number" id="meas-bust" min="1" step="0.1"></div>
              <div class="form-group"><label>${t('measWaist')}</label><input type="number" id="meas-waist" min="1" step="0.1"></div>
              <div class="form-group"><label>${t('measHips')}</label><input type="number" id="meas-hips" min="1" step="0.1"></div>
            </div>
          </div>
        </div>

        <div class="option-block">
          <h4>${t('filterColor')}</h4>
          <div class="color-options" id="pd-colors">
            ${product.colors.map(c => `
              <div class="color-opt ${c[0]===pdSelectedColor?'active':''}" onclick="selectColor('${escapeHtml(c[0])}', this)">
                <div class="swatch-circle" style="background:${c[1]};box-shadow:0 0 0 1px var(--border) inset;"></div>
                ${escapeHtml(colorLabel(c[0]))}
              </div>`).join('')}
          </div>
        </div>

        <div class="option-block">
          <h4>${t('qtyHeading')}</h4>
          <div class="qty-selector">
            <button type="button" onclick="stepQty(-1)">−</button>
            <input type="number" id="pd-qty" value="1" min="1">
            <button type="button" onclick="stepQty(1)">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn btn-primary" ${outOfStock?'disabled':''} onclick="handleAddToCart('${product.id}')">${t('addToCart')}</button>
          <a href="#/catalogue" class="btn btn-outline">${t('continueShopping')}</a>
        </div>
        <div class="stock-note">
          ${outOfStock ? `<span class="badge badge-danger">${t('badgeOutOfStock')}</span>` : `<span class="badge badge-success">${t('inStock')} (${product.stock} ${t('availableCount')})</span>`}
        </div>
      </div>
    </div>
  </div>
  `;
}
function attachProductDetailEvents(){}
function switchGalleryImage(i, el){
  const product = getProducts().find(p => p.id === parseHash()[1]);
  document.getElementById('pd-main-img').src = product.images[i];
  document.querySelectorAll('.gallery-thumbs img').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function selectSize(size, el){
  pdSelectedSize = size;
  document.querySelectorAll('#pd-sizes .size-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById('pd-measurements');
  if(panel) panel.hidden = size !== 'Sur mesure';
}
function selectColor(color, el){
  pdSelectedColor = color;
  document.querySelectorAll('#pd-colors .color-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}
function stepQty(delta){
  const input = document.getElementById('pd-qty');
  let v = parseInt(input.value || '1') + delta;
  if(v < 1) v = 1;
  input.value = v;
}
function handleAddToCart(productId){
  const qty = parseInt(document.getElementById('pd-qty').value || '1');
  let measurements = null;
  if(pdSelectedSize === 'Sur mesure'){
    measurements = {
      height: document.getElementById('meas-height').value,
      bust: document.getElementById('meas-bust').value,
      waist: document.getElementById('meas-waist').value,
      hips: document.getElementById('meas-hips').value
    };
    if(!measurements.height || !measurements.bust || !measurements.waist || !measurements.hips){
      alert(t('alertNeedMeasurements'));
      return;
    }
  }
  addToCart(productId, pdSelectedSize, pdSelectedColor, qty, measurements);
}

/* ==========================================================================
   PAGE : PANIER
   ========================================================================== */
function renderCartPage(){
  const lines = cartLinesWithProducts();
  if(!lines.length){
    return `
    <div class="container cart-page">
      <div class="page-head"><h1>${t('cartTitle')}</h1></div>
      <p class="empty-state">${t('cartEmpty')} <a href="#/catalogue" style="color:var(--purple-dark);text-decoration:underline;">${t('discoverCatalogue')}</a></p>
    </div>`;
  }
  const total = cartTotal();
  return `
  <div class="container cart-page">
    <div class="page-head"><h1>${t('cartTitle')}</h1></div>
    <div class="cart-layout">
      <div class="card-white" style="padding:10px 22px;">
        ${lines.map(l => `
          <div class="cart-item">
            <img src="${l.product.images[0]}" alt="${escapeHtml(prodName(l.product))}">
            <div>
              <div class="cart-item-name">${escapeHtml(prodName(l.product))}</div>
              <div class="cart-item-meta">${t('filterSize')} : ${escapeHtml(sizeLabel(l.size||'-'))} · ${t('filterColor')} : ${escapeHtml(colorLabel(l.color||'-'))}</div>
              ${l.measurements ? `<div class="cart-item-meta">${escapeHtml(measurementsText(l.measurements))}</div>` : ''}
              <div class="qty-selector">
                <button type="button" onclick="updateCartQty(${l.index}, ${l.qty-1})">−</button>
                <input type="number" value="${l.qty}" min="1" onchange="updateCartQty(${l.index}, parseInt(this.value||1))">
                <button type="button" onclick="updateCartQty(${l.index}, ${l.qty+1})">+</button>
              </div>
            </div>
            <div class="cart-item-right">
              <span class="cart-item-price">${formatPrice(l.product.price * l.qty)}</span>
              <button class="cart-item-remove" onclick="removeCartLine(${l.index})">${t('remove')}</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card-white summary-box">
        <h3 style="margin-bottom:18px;">${t('orderSummary')}</h3>
        <div class="summary-row"><span>${t('subtotal')}</span><span>${formatPrice(total)}</span></div>
        <div class="summary-row"><span>${t('shipping')}</span><span>${t('free')}</span></div>
        <div class="summary-row total"><span>${t('total')}</span><span>${formatPrice(total)}</span></div>
        <a href="#/checkout" class="btn btn-primary btn-block" style="margin-top:16px;">${t('orderNow')}</a>
      </div>
    </div>
  </div>
  `;
}

/* ==========================================================================
   PAGE : CHECKOUT
   ========================================================================== */
function renderCheckoutPage(){
  const lines = cartLinesWithProducts();
  if(!lines.length){
    return `<div class="container checkout-page"><div class="page-head"><h1>${t('checkoutPageTitle')}</h1></div><p class="empty-state">${t('cartEmpty')}</p></div>`;
  }
  const total = cartTotal();
  return `
  <div class="container checkout-page">
    <div class="page-head"><h1>${t('checkoutHeading')}</h1></div>
    <div class="checkout-layout">
      <form id="checkout-form" class="card-white" style="padding:26px;" onsubmit="return handleCheckoutSubmit(event)">
        <h3 class="form-section-title">${t('customerInfo')}</h3>
        <div class="form-row form-row-2">
          <div class="form-group"><label>${t('firstName')}</label><input type="text" id="ck-firstname" required></div>
          <div class="form-group"><label>${t('lastName')}</label><input type="text" id="ck-lastname" required></div>
        </div>
        <div class="form-row form-row-2">
          <div class="form-group"><label>${t('emailOptional')}</label><input type="email" id="ck-email"></div>
          <div class="form-group"><label>${t('phone')}</label><input type="tel" id="ck-phone" required></div>
        </div>
        <div class="form-group"><label>${t('address')}</label><input type="text" id="ck-address" required></div>
        <div class="form-row form-row-3">
          <div class="form-group"><label>${t('city')}</label><input type="text" id="ck-city" required></div>
          <div class="form-group"><label>${t('zip')}</label><input type="text" id="ck-zip" required></div>
          <div class="form-group"><label>${t('country')}</label><input type="text" id="ck-country" value="Maroc" required></div>
        </div>

        <p style="color:var(--text-soft);font-size:0.85rem;margin-bottom:16px;">${t('paymentNote')}</p>
        <button type="submit" class="btn btn-primary btn-block">${t('confirmWhatsapp')}</button>
      </form>

      <div class="card-white summary-box">
        <h3 style="margin-bottom:18px;">${t('recap')}</h3>
        ${lines.map(l => `
          <div class="summary-row"><span>${escapeHtml(prodName(l.product))} × ${l.qty}</span><span>${formatPrice(l.product.price*l.qty)}</span></div>
        `).join('')}
        <div class="summary-row total"><span>${t('total')}</span><span>${formatPrice(total)}</span></div>
      </div>
    </div>
  </div>
  `;
}
function attachCheckoutEvents(){}

function buildWhatsAppOrderUrl(order){
  const lignes = order.items.map(i =>
    `• ${i.name} (${t('waSize')} : ${sizeLabel(i.size) || '-'}, ${t('waColor')} : ${colorLabel(i.color) || '-'}) x${i.qty} — ${formatPrice(i.price * i.qty)}`
    + (i.measurements ? `\n  ${t('waMeasurements')} : ${measurementsText(i.measurements)}` : '')
  ).join('\n');
  const c = order.customer;
  const message =
`${t('waTitle')}
${t('waOrderNumber')} : ${order.id}

${t('waItems')} :
${lignes}

${t('waTotal')} : ${formatPrice(order.total)}

${t('waCustomer')} : ${c.firstname} ${c.lastname}
${t('waPhone')} : ${c.phone}
${t('waAddress')} : ${c.address}, ${c.city} ${c.zip}, ${c.country}${c.email ? '\n' + t('waEmail') + ' : ' + c.email : ''}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function handleCheckoutSubmit(e){
  e.preventDefault();
  const lines = cartLinesWithProducts();
  const total = cartTotal();
  const order = {
    id: 'CMD' + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    customer: {
      firstname: document.getElementById('ck-firstname').value,
      lastname: document.getElementById('ck-lastname').value,
      email: document.getElementById('ck-email').value,
      phone: document.getElementById('ck-phone').value,
      address: document.getElementById('ck-address').value,
      city: document.getElementById('ck-city').value,
      zip: document.getElementById('ck-zip').value,
      country: document.getElementById('ck-country').value
    },
    items: lines.map(l => ({ name:prodName(l.product), size:l.size, color:l.color, qty:l.qty, price:l.product.price, measurements:l.measurements || null })),
    total,
    status: 'pending'
  };
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Décrémente le stock des produits commandés
  const products = getProducts();
  lines.forEach(l => {
    const p = products.find(pr => pr.id === l.product.id);
    if(p) p.stock = Math.max(0, p.stock - l.qty);
  });
  saveProducts(products);

  saveCart([]);

  const waUrl = buildWhatsAppOrderUrl(order);
  window.open(waUrl, '_blank');

  document.getElementById('app').innerHTML = `
    <div class="container checkout-confirm">
      <div class="icon-ok">✓</div>
      <h1>${t('thanksTitle')}</h1>
      <p style="color:var(--text-soft);margin:14px 0 24px;">${t('thanksMessage')}</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary">${t('openWhatsapp')}</a>
        <a href="#/catalogue" class="btn btn-outline">${t('continueShopping')}</a>
      </div>
      ${trustSectionHtml(3)}
    </div>
  `;
  return false;
}

/* ==========================================================================
   ADMIN : AUTHENTIFICATION
   ========================================================================== */
const ADMIN_CREDENTIALS = { username:'admin', password:'admin123' };
function isAdminLoggedIn(){ return sessionStorage.getItem('sp_admin_auth') === 'true'; }

function renderAdminRoute(app){
  if(!isAdminLoggedIn()){
    app.innerHTML = renderAdminLogin();
  } else {
    app.innerHTML = renderAdminDashboard();
    attachAdminDashboardEvents();
  }
}
function renderAdminLogin(){
  return `
  <div class="container admin-login-wrap">
    <div class="card-white admin-login-box fade-in">
      <div style="font-size:2rem;">🔒</div>
      <h2>${t('navAdmin')}</h2>
      <p>${t('adminLoginSubtitle')}</p>
      <form onsubmit="return handleAdminLogin(event)">
        <div class="form-group" style="text-align:start;">
          <label>${t('username')}</label>
          <input type="text" id="admin-user" required>
        </div>
        <div class="form-group" style="text-align:start;">
          <label>${t('password')}</label>
          <input type="password" id="admin-pass" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${t('loginBtn')}</button>
        <p class="admin-error" id="admin-error">${t('loginError')}</p>
      </form>
      <div class="admin-hint">${t('demoCreds')} <strong>admin</strong> / <strong>admin123</strong></div>
    </div>
  </div>
  `;
}
function handleAdminLogin(e){
  e.preventDefault();
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;
  if(user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password){
    sessionStorage.setItem('sp_admin_auth','true');
    renderRoute();
  } else {
    document.getElementById('admin-error').style.display = 'block';
  }
  return false;
}
function adminLogout(){
  sessionStorage.removeItem('sp_admin_auth');
  navigate('#/');
}

/* ==========================================================================
   ADMIN : DASHBOARD (Produits & Commandes)
   ========================================================================== */
let adminActiveTab = 'produits';
let uploadedImages = [];

function renderAdminDashboard(){
  const products = getProducts();
  const orders = getOrders();
  return `
  <div class="container admin-shell">
    <div class="admin-topbar">
      <div>
        <div class="crumbs"><a href="#/">${t('navHome')}</a> / ${t('navAdmin')}</div>
        <h1>${t('dashboardTitle')}</h1>
      </div>
      <button class="btn btn-outline btn-sm" onclick="adminLogout()">${t('logout')}</button>
    </div>

    <div class="admin-stats">
      <div class="card-white stat-card"><div class="stat-value">${products.length}</div><div class="stat-label">${t('productsLabel')}</div></div>
      <div class="card-white stat-card"><div class="stat-value">${products.filter(p=>p.stock<=0).length}</div><div class="stat-label">${t('outOfStockLabel')}</div></div>
      <div class="card-white stat-card"><div class="stat-value">${orders.length}</div><div class="stat-label">${t('ordersLabel')}</div></div>
      <div class="card-white stat-card"><div class="stat-value">${formatPrice(orders.reduce((s,o)=>s+o.total,0))}</div><div class="stat-label">${t('revenueLabel')}</div></div>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab ${adminActiveTab==='produits'?'active':''}" onclick="switchAdminTab('produits')">${t('productsLabel')}</button>
      <button class="admin-tab ${adminActiveTab==='commandes'?'active':''}" onclick="switchAdminTab('commandes')">${t('ordersLabel')}</button>
    </div>

    <div id="admin-tab-content"></div>
  </div>
  `;
}
function attachAdminDashboardEvents(){ renderAdminTabContent(); }
function switchAdminTab(tab){
  adminActiveTab = tab;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  renderAdminTabContent();
}
function renderAdminTabContent(){
  const container = document.getElementById('admin-tab-content');
  if(!container) return;
  container.innerHTML = adminActiveTab === 'produits' ? renderAdminProductsTab() : renderAdminOrdersTab();
}

function renderAdminProductsTab(){
  const products = getProducts();
  return `
  <div style="margin-bottom:18px;">
    <button class="btn btn-primary" onclick="openProductModal()">${t('addProductBtn')}</button>
  </div>
  <div class="admin-prod-grid">
    ${products.map(p => `
      <div class="card-white admin-prod-card">
        <img src="${p.images[0]}" alt="${escapeHtml(p.name)}">
        <div class="apc-info">
          <h4>${escapeHtml(p.name)}</h4>
          <div class="apc-price">${formatPrice(p.price)}</div>
          <div class="apc-stock">${p.stock > 0 ? t('stockLabel')+p.stock : `<span style="color:var(--danger);">${t('badgeOutOfStock')}</span>`}</div>
          <div class="admin-prod-actions">
            <button class="btn btn-outline btn-sm" onclick="openProductModal('${p.id}')">${t('editBtn')}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">${t('remove')}</button>
          </div>
        </div>
      </div>
    `).join('') || `<p class="empty-state">${t('noProducts')}</p>`}
  </div>
  `;
}
function renderAdminOrdersTab(){
  const orders = getOrders().slice().reverse();
  if(!orders.length) return `<p class="empty-state">${t('noOrders')}</p>`;
  return `
  <div class="card-white orders-table-wrap" style="padding:6px 10px;">
    <table class="orders-table">
      <thead><tr><th>${t('orderNumber')}</th><th>${t('customerLabel')}</th><th>${t('articlesLabel')}</th><th>${t('total')}</th><th>${t('dateLabel')}</th><th>${t('statusLabel')}</th></tr></thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>${o.id}</td>
            <td>${escapeHtml(o.customer.firstname)} ${escapeHtml(o.customer.lastname)}<br><span class="order-items-mini">${escapeHtml(o.customer.email)}</span></td>
            <td class="order-items-mini">${o.items.map(i => `${escapeHtml(i.name)} (${i.qty})`).join(', ')}</td>
            <td>${formatPrice(o.total)}</td>
            <td>${new Date(o.date).toLocaleDateString(LANG === 'ar' ? 'ar-MA' : 'fr-FR')}</td>
            <td>
              <span class="order-status-badge ${o.status === 'confirmed' ? 'confirmed' : 'pending'}">${o.status === 'confirmed' ? t('orderStatusConfirmed') : t('orderStatusPending')}</span>
              ${o.status !== 'confirmed' ? `<br><button class="btn btn-outline btn-sm" style="margin-top:6px;white-space:normal;" onclick="confirmOrder('${o.id}')">${t('adminConfirmOrderBtn')}</button>` : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  `;
}
// Convertit un numéro local marocain (ex. 06...) au format international attendu par wa.me
function normalizePhoneForWhatsApp(phone){
  let digits = (phone || '').replace(/[^0-9]/g, '');
  if(digits.startsWith('0')) digits = '212' + digits.slice(1);
  return digits;
}
function buildWhatsAppConfirmedUrl(order){
  const message = `${t('waConfirmedGreeting').replace('{id}', order.id)}\n${t('waConfirmedBody')}`;
  return `https://wa.me/${normalizePhoneForWhatsApp(order.customer.phone)}?text=${encodeURIComponent(message)}`;
}
function confirmOrder(orderId){
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if(!order) return;
  order.status = 'confirmed';
  saveOrders(orders);
  window.open(buildWhatsAppConfirmedUrl(order), '_blank');
  showToast(t('toastOrderConfirmed'));
  renderAdminTabContent();
}

/* ---- Modal Ajout / Modification produit ---- */
function openProductModal(productId){
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  form.reset();
  uploadedImages = [];
  document.querySelectorAll('#pf-sizes input, #pf-colors input').forEach(c => c.checked = false);

  if(productId){
    const p = getProducts().find(pr => pr.id === productId);
    document.getElementById('modal-title').textContent = t('modalEditTitle');
    document.getElementById('pf-id').value = p.id;
    document.getElementById('pf-name').value = p.name;
    document.getElementById('pf-name-ar').value = p.nameAr || '';
    document.getElementById('pf-desc').value = p.description;
    document.getElementById('pf-desc-ar').value = p.descriptionAr || '';
    document.getElementById('pf-price').value = p.price;
    document.getElementById('pf-stock').value = p.stock;
    document.getElementById('pf-category').value = p.category;
    document.getElementById('pf-featured').checked = !!p.featured;
    p.sizes.forEach(s => { const c = document.querySelector(`#pf-sizes input[value="${s}"]`); if(c) c.checked = true; });
    p.colors.forEach(c => { const box = document.querySelector(`#pf-colors input[value="${c[0]}|${c[1]}"]`); if(box) box.checked = true; });
    uploadedImages = [...p.images];
    renderImagePreview();
  } else {
    document.getElementById('modal-title').textContent = t('modalAddTitle');
    document.getElementById('pf-id').value = '';
    renderImagePreview();
  }
  modal.classList.add('open');
}
function closeProductModal(){ document.getElementById('product-modal').classList.remove('open'); }

function handleImageUpload(e){
  const files = Array.from(e.target.files);
  let remaining = files.length;
  if(!remaining) return;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedImages.push(ev.target.result);
      renderImagePreview();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}
function removeUploadedImage(i){
  uploadedImages.splice(i,1);
  renderImagePreview();
}
function renderImagePreview(){
  const el = document.getElementById('pf-images-preview');
  el.innerHTML = uploadedImages.map((img,i) => `
    <div class="img-upload-item">
      <img src="${img}">
      <div class="remove-img" onclick="removeUploadedImage(${i})">&times;</div>
    </div>
  `).join('');
}

function handleProductFormSubmit(e){
  e.preventDefault();
  if(!uploadedImages.length){
    alert(t('alertNeedImage'));
    return false;
  }
  const sizes = Array.from(document.querySelectorAll('#pf-sizes input:checked')).map(c => c.value);
  const colors = Array.from(document.querySelectorAll('#pf-colors input:checked')).map(c => c.value.split('|'));
  if(!sizes.length || !colors.length){
    alert(t('alertNeedSizeColor'));
    return false;
  }
  const id = document.getElementById('pf-id').value;
  const products = getProducts();
  const data = {
    name: document.getElementById('pf-name').value,
    nameAr: document.getElementById('pf-name-ar').value,
    description: document.getElementById('pf-desc').value,
    descriptionAr: document.getElementById('pf-desc-ar').value,
    price: parseFloat(document.getElementById('pf-price').value),
    stock: parseInt(document.getElementById('pf-stock').value),
    category: document.getElementById('pf-category').value,
    featured: document.getElementById('pf-featured').checked,
    sizes, colors,
    images: [...uploadedImages]
  };

  if(id){
    const idx = products.findIndex(p => p.id === id);
    products[idx] = { ...products[idx], ...data };
    showToast(t('toastProductUpdated'));
  } else {
    products.push({ id:'p'+Date.now(), createdAt: Date.now(), ...data });
    showToast(t('toastProductAdded'));
  }
  saveProducts(products);
  closeProductModal();
  renderAdminTabContent();
  return false;
}
function deleteProduct(id){
  if(!confirm(t('confirmDeleteProduct'))) return;
  saveProducts(getProducts().filter(p => p.id !== id));
  showToast(t('toastProductDeleted'));
  renderAdminTabContent();
}

/* ==========================================================================
   INITIALISATION
   ========================================================================== */
document.getElementById('burger-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => {
  seedProductsIfEmpty();
  migrateDemoTranslations();
  applyLangToDocument();
  updateCartBadge();
  renderRoute();
});
