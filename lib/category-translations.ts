export type CategoryLang = 'en' | 'de' | 'tr' | 'pl' | 'fr' | 'es'

export interface CategoryCommonTranslations {
  allPHEVs: string
  curatedCategory: string
  modelsAvailable: string
  battery: string
  power: string
  fuel: string
  viewSpecs: string
  electricRange: string
  searchLanguage: string
  vehicle: string
  details: string
  dcCharging: string
  price: string
  acceleration: string
  seats: string
}

export interface CategorySpecificTranslations {
  badge: string
  heroTitle: string
  heroTitleGradient: string
  heroSubtitle: string
  stat1Label: string
  stat2Label: string
  stat3Label: string
  rankedByTitle: string
  rankedBySubtitle: string
  tableTitle: string
  tableSubtitle: string
}

export const COMMON_TRANSLATIONS: Record<CategoryLang, CategoryCommonTranslations> = {
  en: {
    allPHEVs: 'All PHEVs',
    curatedCategory: 'Curated Category',
    modelsAvailable: 'Models Available',
    battery: 'Battery',
    power: 'Power',
    fuel: 'Fuel',
    viewSpecs: 'View Full Specifications →',
    electricRange: 'Electric Range',
    searchLanguage: 'Language',
    vehicle: 'Vehicle',
    details: 'Details',
    dcCharging: 'DC Fast Charge',
    price: 'Starting Price',
    acceleration: '0-100 km/h',
    seats: 'Seats'
  },
  tr: {
    allPHEVs: 'Tüm PHEV\'ler',
    curatedCategory: 'Özel Kategori',
    modelsAvailable: 'Model Listeleniyor',
    battery: 'Batarya',
    power: 'Güç',
    fuel: 'Tüketim',
    viewSpecs: 'Tüm Teknik Özellikleri Gör →',
    electricRange: 'Elektrikli Menzil',
    searchLanguage: 'Dil',
    vehicle: 'Araç',
    details: 'Detaylar',
    dcCharging: 'DC Hızlı Şarj',
    price: 'Başlangıç Fiyatı',
    acceleration: '0-100 km/s',
    seats: 'Koltuk Sayısı'
  },
  de: {
    allPHEVs: 'Alle PHEVs',
    curatedCategory: 'Kuratierte Kategorie',
    modelsAvailable: 'Modelle verfügbar',
    battery: 'Batterie',
    power: 'Leistung',
    fuel: 'Verbrauch',
    viewSpecs: 'Vollständige Spezifikationen →',
    electricRange: 'Elektrische Reichweite',
    searchLanguage: 'Sprache',
    vehicle: 'Fahrzeug',
    details: 'Details',
    dcCharging: 'DC-Schnellladen',
    price: 'Ab-Preis',
    acceleration: '0-100 km/h',
    seats: 'Sitze'
  },
  pl: {
    allPHEVs: 'Wszystkie PHEV',
    curatedCategory: 'Wybrana kategoria',
    modelsAvailable: 'Dostępne modele',
    battery: 'Bateria',
    power: 'Moc',
    fuel: 'Spalanie',
    viewSpecs: 'Pełna specyfikacja →',
    electricRange: 'Zasięg elektryczny',
    searchLanguage: 'Język',
    vehicle: 'Pojazd',
    details: 'Szczegóły',
    dcCharging: 'Szybkie ładowanie DC',
    price: 'Cena od',
    acceleration: '0-100 km/h',
    seats: 'Miejsca'
  },
  fr: {
    allPHEVs: 'Tous les PHEV',
    curatedCategory: 'Catégorie sélectionnée',
    modelsAvailable: 'Modèles disponibles',
    battery: 'Batterie',
    power: 'Puissance',
    fuel: 'Conso',
    viewSpecs: 'Voir la fiche technique →',
    electricRange: 'Autonomie électrique',
    searchLanguage: 'Langue',
    vehicle: 'Véhicule',
    details: 'Détails',
    dcCharging: 'Charge rapide DC',
    price: 'Prix de départ',
    acceleration: '0-100 km/h',
    seats: 'Places'
  },
  es: {
    allPHEVs: 'Todos los PHEV',
    curatedCategory: 'Categoría destacada',
    modelsAvailable: 'Modelos disponibles',
    battery: 'Batería',
    power: 'Potencia',
    fuel: 'Consumo',
    viewSpecs: 'Ver especificaciones completas →',
    electricRange: 'Autonomía eléctrica',
    searchLanguage: 'Idioma',
    vehicle: 'Vehículo',
    details: 'Detalles',
    dcCharging: 'Carga rápida DC',
    price: 'Precio desde',
    acceleration: '0-100 km/h',
    seats: 'Plazas'
  }
}

export const CATEGORY_TRANSLATIONS: Record<string, Record<CategoryLang, CategorySpecificTranslations>> = {
  'longest-range-phev': {
    en: {
      badge: '100+ KM Electric Range',
      heroTitle: 'PHEVs with the',
      heroTitleGradient: 'Longest Electric Range',
      heroSubtitle: 'Explore Europe\'s longest-range plug-in hybrids offering over 100 km of pure electric driving. Daily commutes with zero tailpipe emissions, backed by petrol engines for unlimited road trip range.',
      stat1Label: 'Models Available',
      stat2Label: 'WLTP Range',
      stat3Label: 'Batteries up to',
      rankedByTitle: 'Ranked by Pure Electric Range (WLTP)',
      rankedBySubtitle: 'Showing all homologated plug-in hybrids delivering 100 km or more',
      tableTitle: '100+ km Electric Range PHEV Comparison Table',
      tableSubtitle: 'Side-by-side technical comparison of European plug-in hybrids sorted by WLTP electric range.'
    },
    tr: {
      badge: '100+ KM Elektrikli Menzil',
      heroTitle: 'En Uzun',
      heroTitleGradient: 'Elektrikli Menzilli PHEV\'ler',
      heroSubtitle: 'Saf elektrikle 100 km ve üzeri yol yapabilen Avrupa\'nın lider plug-in hibrit modellerini inceleyin. Şehir içinde sıfır yakıt tüketimi, uzun yolda sınırsız benzin gücü.',
      stat1Label: 'Model Mevcut',
      stat2Label: 'WLTP Menzil',
      stat3Label: 'En Büyük Batarya',
      rankedByTitle: 'Saf Elektrikli Menzile Göre Sıralı (WLTP)',
      rankedBySubtitle: '100 km ve üzeri elektrikli menzil sunan tüm resmi plug-in hibrit modeller',
      tableTitle: '100+ km Menzilli PHEV Karşılaştırma Tablosu',
      tableSubtitle: 'Avrupa pazarındaki plug-in hibritlerin resmi WLTP elektrikli menzil sıralaması.'
    },
    de: {
      badge: '100+ KM Elektrische Reichweite',
      heroTitle: 'PHEVs mit der',
      heroTitleGradient: 'Höchsten E-Reichweite',
      heroSubtitle: 'Entdecken Sie Europas reichweitenstärkste Plug-in-Hybride mit über 100 km rein elektrischer Reichweite für tägliches emissionsfreies Pendeln.',
      stat1Label: 'Modelle verfügbar',
      stat2Label: 'WLTP-Reichweite',
      stat3Label: 'Batterien bis zu',
      rankedByTitle: 'Sortiert nach elektrischer Reichweite (WLTP)',
      rankedBySubtitle: 'Alle homologierten Plug-in-Hybride mit mindestens 100 km E-Reichweite',
      tableTitle: '100+ km E-Reichweite Vergleichstabelle',
      tableSubtitle: 'Direkter technischer Vergleich nach offizieller WLTP-Reichweite.'
    },
    pl: {
      badge: 'Zasięg 100+ KM EV',
      heroTitle: 'Hybrydy PHEV o',
      heroTitleGradient: 'Największym Zasięgu',
      heroSubtitle: 'Poznaj hybrydy plug-in oferujące ponad 100 km zasięgu w trybie czysto elektrycznym w Europie.',
      stat1Label: 'Dostępne modele',
      stat2Label: 'Zasięg WLTP',
      stat3Label: 'Baterie do',
      rankedByTitle: 'Ranking według zasięgu elektrycznego (WLTP)',
      rankedBySubtitle: 'Wszystkie modele z homologacją powyżej 100 km na jednym ładowaniu',
      tableTitle: 'Tabela porównawcza PHEV z zasięgiem 100+ km',
      tableSubtitle: 'Szczegółowe zestawienie parametrów technicznych według danych WLTP.'
    },
    fr: {
      badge: '100+ KM d\'Autonomie Électrique',
      heroTitle: 'Les PHEV avec la',
      heroTitleGradient: 'Plus Grande Autonomie',
      heroSubtitle: 'Découvrez les hybrides rechargeables européens offrant plus de 100 km d\'autonomie 100% électrique.',
      stat1Label: 'Modèles disponibles',
      stat2Label: 'Autonomie WLTP',
      stat3Label: 'Batteries jusqu\'à',
      rankedByTitle: 'Classés par autonomie électrique (WLTP)',
      rankedBySubtitle: 'Tous les véhicules homologués offrant 100 km ou plus',
      tableTitle: 'Tableau comparatif des PHEV 100+ km',
      tableSubtitle: 'Comparaison technique des modèles selon les normes officielles WLTP.'
    },
    es: {
      badge: '100+ KM de Autonomía Eléctrica',
      heroTitle: 'PHEV con la',
      heroTitleGradient: 'Mayor Autonomía Eléctrica',
      heroSubtitle: 'Descubra los híbridos enchufables con más de 100 km de autonomía en modo 100% eléctrico.',
      stat1Label: 'Modelos disponibles',
      stat2Label: 'Autonomía WLTP',
      stat3Label: 'Baterías hasta',
      rankedByTitle: 'Ordenados por autonomía eléctrica pura (WLTP)',
      rankedBySubtitle: 'Todos los modelos homologados con 100 km o más de rango eléctrico',
      tableTitle: 'Tabla comparativa de PHEV con 100+ km de autonomía',
      tableSubtitle: 'Comparativa técnica detallada según las cifras oficiales WLTP.'
    }
  },
  'phev-with-dc-charging': {
    en: {
      badge: 'DC Fast Charging Supported',
      heroTitle: 'PHEVs with',
      heroTitleGradient: 'DC Fast Charging (CCS)',
      heroSubtitle: 'Charge from 10% to 80% in 20–30 minutes at motorway DC rapid stations. Discover rare plug-in hybrids equipped with public fast-charging capability.',
      stat1Label: 'DC Models',
      stat2Label: 'Max DC Speed',
      stat3Label: '10-80% Time',
      rankedByTitle: 'Ranked by DC Charging Power (kW)',
      rankedBySubtitle: 'Every European plug-in hybrid equipped with CCS Combo 2 or CHAdeMO DC charging',
      tableTitle: 'DC Fast-Charging PHEV Comparison Table',
      tableSubtitle: 'Charging speeds, port standards, and battery recharge times for fast-charging hybrids.'
    },
    tr: {
      badge: 'DC Hızlı Şarj Destekli',
      heroTitle: 'DC Hızlı Şarjlı',
      heroTitleGradient: 'Plug-in Hibritler (CCS)',
      heroSubtitle: 'Otoyol dinlenme tesislerindeki hızlı şarj istasyonlarında 20-30 dakikada %10\'dan %80\'e şarj olan özel PHEV modellerini keşfedin.',
      stat1Label: 'DC Model',
      stat2Label: 'Maks. DC Hız',
      stat3Label: '10-%80 Süresi',
      rankedByTitle: 'DC Şarj Gücüne Göre Sıralı (kW)',
      rankedBySubtitle: 'CCS Combo 2 veya CHAdeMO DC hızlı şarj destekli tüm Avrupa PHEV modelleri',
      tableTitle: 'DC Hızlı Şarjlı PHEV Karşılaştırma Tablosu',
      tableSubtitle: 'Şarj güçleri, soket tipleri ve batarya dolum süreleri tablosu.'
    },
    de: {
      badge: 'DC-Schnellladung unterstützt',
      heroTitle: 'PHEVs mit',
      heroTitleGradient: 'DC-Schnellladung (CCS)',
      heroSubtitle: 'Laden Sie an Autobahn-Schnellladern in nur 20–30 Minuten von 10% auf 80% auf.',
      stat1Label: 'DC-Modelle',
      stat2Label: 'Max. DC-Ladeleistung',
      stat3Label: '10-80% Ladezeit',
      rankedByTitle: 'Sortiert nach DC-Ladeleistung (kW)',
      rankedBySubtitle: 'Alle europäischen PHEVs mit CCS Combo 2 oder CHAdeMO Schnellladeanschluss',
      tableTitle: 'DC-Schnelllade-PHEV Vergleichstabelle',
      tableSubtitle: 'Ladeleistung, Steckerstandards und Ladezeiten im Überblick.'
    },
    pl: {
      badge: 'Szybkie Ładowanie DC',
      heroTitle: 'Hybrydy PHEV z',
      heroTitleGradient: 'Szybkim Ładowaniem DC (CCS)',
      heroSubtitle: 'Ładowanie od 10% do 80% w 20–30 minut na stacjach szybkiego ładowania przy autostradach.',
      stat1Label: 'Modele z DC',
      stat2Label: 'Maks. moc DC',
      stat3Label: 'Czas 10-80%',
      rankedByTitle: 'Ranking według mocy ładowania DC (kW)',
      rankedBySubtitle: 'Wszystkie hybrydy plug-in ze złączem CCS Combo 2 lub CHAdeMO w Europie',
      tableTitle: 'Tabela hybryd plug-in z szybkim ładowaniem DC',
      tableSubtitle: 'Moc ładowania, standardy portów i czas uzupełniania energii.'
    },
    fr: {
      badge: 'Charge Rapide DC Compatible',
      heroTitle: 'Les PHEV avec',
      heroTitleGradient: 'Charge Rapide DC (CCS)',
      heroSubtitle: 'Rechargez de 10% à 80% en 20 à 30 minutes sur les bornes rapides d\'autoroute.',
      stat1Label: 'Modèles DC',
      stat2Label: 'Puissance DC Max',
      stat3Label: 'Temps 10-80%',
      rankedByTitle: 'Classés par puissance de charge DC (kW)',
      rankedBySubtitle: 'Tous les PHEV européens équipés de prises CCS Combo 2 ou CHAdeMO',
      tableTitle: 'Tableau comparatif des PHEV à charge rapide DC',
      tableSubtitle: 'Puissances de charge, connecteurs et temps de recharge.'
    },
    es: {
      badge: 'Carga Rápida DC Soportada',
      heroTitle: 'PHEV con',
      heroTitleGradient: 'Carga Rápida DC (CCS)',
      heroSubtitle: 'Cargue del 10% al 80% en 20–30 minutos en estaciones de carga rápida de autopista.',
      stat1Label: 'Modelos con DC',
      stat2Label: 'Potencia DC Máx.',
      stat3Label: 'Tiempo 10-80%',
      rankedByTitle: 'Ordenados por potencia de carga DC (kW)',
      rankedBySubtitle: 'Híbridos enchufables con puerto CCS Combo 2 o CHAdeMO en Europa',
      tableTitle: 'Tabla comparativa de PHEV con carga rápida DC',
      tableSubtitle: 'Velocidades de recarga, tipos de conector y tiempos de carga.'
    }
  },
  'cheapest-phev-europe': {
    en: {
      badge: 'Best Value & Entry-Level Pricing',
      heroTitle: 'Most Affordable',
      heroTitleGradient: 'Cheapest PHEVs in Europe',
      heroSubtitle: 'Discover every plug-in hybrid electric car priced under €45,000. Slash your weekly fuel bills with pure electric commuting while enjoying affordable purchase prices and generous tax breaks.',
      stat1Label: 'Starting Price',
      stat2Label: 'Under €30,000',
      stat3Label: 'Avg EV Range',
      rankedByTitle: 'Ranked by Base Price (EUR)',
      rankedBySubtitle: 'Most accessible new plug-in hybrid vehicles on the European market',
      tableTitle: 'Affordable PHEVs Price & Specs Comparison',
      tableSubtitle: 'Compare entry MSRP prices, EV range, and fuel savings side-by-side.'
    },
    tr: {
      badge: 'En İyi Fiyat & Bütçe Dostu Fırsatlar',
      heroTitle: 'Avrupa\'nın',
      heroTitleGradient: 'En Ucuz ve Ekonomik PHEV\'leri',
      heroSubtitle: 'Avrupa pazarında 45.000 € altındaki en bütçe dostu plug-in hibrit modelleri keşfedin. Uygun satın alma fiyatı ve maksimum yakıt tasarrufuyla bütçenizi koruyun.',
      stat1Label: 'Başlangıç Fiyatı',
      stat2Label: '30.000 € Altı',
      stat3Label: 'Ortalama Menzil',
      rankedByTitle: 'Başlangıç Fiyatına Göre Sıralı (EUR)',
      rankedBySubtitle: 'Avrupa\'da satın alınabilecek en ekonomik yeni plug-in hibrit araçlar',
      tableTitle: 'Ekonomik PHEV Fiyat ve Özellik Tablosu',
      tableSubtitle: 'Fiyatlar, elektrikli menzil ve yakıt tüketim karşılaştırması.'
    },
    de: {
      badge: 'Bestes Preis-Leistungs-Verhältnis',
      heroTitle: 'Die günstigsten',
      heroTitleGradient: 'PHEVs in Europa unter 45.000 €',
      heroSubtitle: 'Entdecken Sie alle bezahlbaren Plug-in-Hybride unter 45.000 € in Europa für maximale Kraftstoffersparnis.',
      stat1Label: 'Ab-Preis',
      stat2Label: 'Unter 30.000 €',
      stat3Label: 'Ø E-Reichweite',
      rankedByTitle: 'Sortiert nach Grundpreis (EUR)',
      rankedBySubtitle: 'Die preiswertesten neuen Plug-in-Hybrid-Fahrzeuge in Europa',
      tableTitle: 'Günstige PHEVs Preis- und Datenvergleich',
      tableSubtitle: 'Kaufpreise, Reichweiten und Ersparnisse im Direktvergleich.'
    },
    pl: {
      badge: 'Najlepszy Stosunek Ceny do Jakości',
      heroTitle: 'Najbardziej przystępne',
      heroTitleGradient: 'Najtańsze Hybrydy PHEV w Europie',
      heroSubtitle: 'Odkryj hybrydy plug-in w cenie poniżej 45 000 € z niskimi kosztami eksploatacji.',
      stat1Label: 'Cena od',
      stat2Label: 'Poniżej 30 000 €',
      stat3Label: 'Śr. zasięg EV',
      rankedByTitle: 'Ranking według ceny bazowej (EUR)',
      rankedBySubtitle: 'Najbardziej przystępne cenowo hybrydy plug-in na rynku europejskim',
      tableTitle: 'Tabela tanich hybryd PHEV',
      tableSubtitle: 'Zestawienie cen zakupu, zasięgu EV i oszczędności paliwa.'
    },
    fr: {
      badge: 'Meilleur Rapport Qualité/Prix',
      heroTitle: 'Les hybrides rechargeables',
      heroTitleGradient: 'Les Moins Chers d\'Europe',
      heroSubtitle: 'Découvrez tous les véhicules PHEV à moins de 45 000 € en Europe.',
      stat1Label: 'Prix à partir de',
      stat2Label: 'Sous 30 000 €',
      stat3Label: 'Autonomie moy.',
      rankedByTitle: 'Classés par prix de base (EUR)',
      rankedBySubtitle: 'Les modèles PHEV neufs les plus accessibles du marché européen',
      tableTitle: 'Tableau comparatif des PHEV abordables',
      tableSubtitle: 'Prix catalogue, autonomie et économies d\'énergie.'
    },
    es: {
      badge: 'Mejor Relación Calidad-Precio',
      heroTitle: 'Los más económicos',
      heroTitleGradient: 'PHEV Más Baratos de Europa',
      heroSubtitle: 'Descubra todos los híbridos enchufables por debajo de 45.000 € en Europa.',
      stat1Label: 'Precio desde',
      stat2Label: 'Menos de 30.000 €',
      stat3Label: 'Autonomía media',
      rankedByTitle: 'Ordenados por precio base (EUR)',
      rankedBySubtitle: 'Los híbridos enchufables más asequibles del mercado europeo',
      tableTitle: 'Tabla de PHEV económicos y especificaciones',
      tableSubtitle: 'Comparativa de precios de entrada, autonomía y consumo.'
    }
  },
  'best-selling-phev-europe': {
    en: {
      badge: 'ACEA Official Sales Ranking',
      heroTitle: 'Top 10',
      heroTitleGradient: 'Best-Selling PHEVs in Europe',
      heroSubtitle: 'Official European registration data: The most popular plug-in hybrid vehicles chosen by drivers across the continent.',
      stat1Label: 'Top Models',
      stat2Label: 'Sales Leader',
      stat3Label: 'Market Share',
      rankedByTitle: 'Official Registration Ranking',
      rankedBySubtitle: 'Based on ACEA and JATO Dynamics European automotive registration statistics',
      tableTitle: 'Best-Selling PHEVs Official Ranking Table',
      tableSubtitle: 'Sales volume, market position, and key specs of Europe\'s favourite PHEVs.'
    },
    tr: {
      badge: 'Resmi ACEA Satış Sıralaması',
      heroTitle: 'Avrupa\'da En Çok Satan',
      heroTitleGradient: 'İlk 10 Plug-in Hibrit',
      heroSubtitle: 'Resmi ACEA tescil verileri: Avrupa genelinde sürücülerin en çok tercih ettiği 1 numaralı plug-in hibrit modeller.',
      stat1Label: 'Lider Model',
      stat2Label: 'Satış Şampiyonu',
      stat3Label: 'Pazar Hacmi',
      rankedByTitle: 'Resmi Satış Sıralaması',
      rankedBySubtitle: 'ACEA ve JATO Dynamics Avrupa resmi otomobil tescil verilerine göre',
      tableTitle: 'En Çok Satan PHEV\'ler Sıralama Tablosu',
      tableSubtitle: 'Satış adetleri, pazar konumu ve temel teknik veriler.'
    },
    de: {
      badge: 'Offizielles ACEA-Verkaufsranking',
      heroTitle: 'Top 10',
      heroTitleGradient: 'Meistverkaufte PHEVs in Europa',
      heroSubtitle: 'Offizielle europäische Zulassungszahlen: Die beliebtesten Plug-in-Hybride europäischer Autofahrer.',
      stat1Label: 'Top-Modelle',
      stat2Label: 'Marktführer',
      stat3Label: 'Marktanteil',
      rankedByTitle: 'Offizielles Zulassungsranking',
      rankedBySubtitle: 'Basierend auf offiziellen Zahlen von ACEA und JATO Dynamics',
      tableTitle: 'Meistverkaufte PHEVs Übersichtstabelle',
      tableSubtitle: 'Absatzzahlen, Marktposition und technische Eckdaten.'
    },
    pl: {
      badge: 'Oficjalny Ranking Sprzedaży ACEA',
      heroTitle: 'Top 10',
      heroTitleGradient: 'Najlepiej Sprzedających Się PHEV',
      heroSubtitle: 'Oficjalne dane rejestracji w Europie: najpopularniejsze hybrydy plug-in wybrane przez kierowców.',
      stat1Label: 'Czołowe modele',
      stat2Label: 'Lider sprzedaży',
      stat3Label: 'Udział w rynku',
      rankedByTitle: 'Oficjalny ranking rejestracji',
      rankedBySubtitle: 'Na podstawie oficjalnych statystyk ACEA i JATO Dynamics',
      tableTitle: 'Tabela sprzedaży liderów rynku PHEV',
      tableSubtitle: 'Liczba rejestracji, pozycja na rynku i specyfikacja.'
    },
    fr: {
      badge: 'Classement Officiel ACEA',
      heroTitle: 'Top 10 des',
      heroTitleGradient: 'PHEV les Plus Vendus en Europe',
      heroSubtitle: 'Données officielles d\'immatriculation en Europe : les modèles plébiscités par les automobilistes.',
      stat1Label: 'Top Modèles',
      stat2Label: 'Leader des ventes',
      stat3Label: 'Part de marché',
      rankedByTitle: 'Classement officiel des immatriculations',
      rankedBySubtitle: 'D\'après les statistiques européennes de l\'ACEA et de JATO Dynamics',
      tableTitle: 'Tableau des meilleures ventes de PHEV',
      tableSubtitle: 'Volumes de vente, rang et données clés des leaders du marché.'
    },
    es: {
      badge: 'Ranking Oficial de Ventas ACEA',
      heroTitle: 'Top 10 de los',
      heroTitleGradient: 'PHEV Más Vendidos en Europa',
      heroSubtitle: 'Cifras oficiales de matriculación en Europa: los híbridos enchufables preferidos por los conductores.',
      stat1Label: 'Modelos líderes',
      stat2Label: 'Líder en ventas',
      stat3Label: 'Cuota de mercado',
      rankedByTitle: 'Ranking oficial de matriculaciones',
      rankedBySubtitle: 'Basado en estadísticas oficiales de la ACEA y JATO Dynamics',
      tableTitle: 'Tabla de los PHEV más vendidos en Europa',
      tableSubtitle: 'Volumen de ventas, posición de mercado y especificaciones.'
    }
  },
  'fastest-accelerating-phev': {
    en: {
      badge: '0-100 km/h Kings',
      heroTitle: 'Fastest Accelerating',
      heroTitleGradient: 'PHEVs in Europe (0-100 km/h)',
      heroSubtitle: 'Explore the quickest plug-in hybrid cars in Europe. From 700+ horsepower super-SUVs to sharp sports saloons, see which electrified models sprint from 0 to 100 km/h the fastest.',
      stat1Label: 'Speed Kings',
      stat2Label: 'Quickest 0-100',
      stat3Label: 'Max Power',
      rankedByTitle: 'Ranked by 0-100 km/h Sprint Time',
      rankedBySubtitle: 'Pure performance plug-in hybrids sorted by quickest acceleration',
      tableTitle: 'Fastest PHEVs Acceleration & Power Comparison Table',
      tableSubtitle: '0-100 km/h acceleration, combined horsepower, and top speeds.'
    },
    tr: {
      badge: '0-100 km/s Liderleri',
      heroTitle: 'Avrupa\'nın',
      heroTitleGradient: 'En Hızlı Hızlanan PHEV\'leri',
      heroSubtitle: 'Avrupa\'nın en seri plug-in hibrit modellerini keşfedin. Çift motor gücü ve anlık elektrik torkuyla 0\'dan 100 km/s hıza nefes kesen sürelerde ulaşan performans canavarları.',
      stat1Label: 'Performans Modeli',
      stat2Label: 'En Hızlı 0-100',
      stat3Label: 'En Yüksek Güç',
      rankedByTitle: '0-100 km/s Hızlanma Süresine Göre Sıralı',
      rankedBySubtitle: 'En seri ivmelenen Avrupa pazarı plug-in hibrit spor ve SUV modelleri',
      tableTitle: 'En Hızlı PHEV\'ler Performans ve Hızlanma Tablosu',
      tableSubtitle: '0-100 km/s süreleri, toplam beygir gücü ve azami hız değerleri.'
    },
    de: {
      badge: '0-100 km/h Spitzenreiter',
      heroTitle: 'Die am schnellsten',
      heroTitleGradient: 'Beschleunigenden PHEVs (0-100)',
      heroSubtitle: 'Die schnellsten Plug-in-Hybride in Europa mit bärenstarker Systemleistung und sofortigem Elektro-Drehmoment.',
      stat1Label: 'Sport-Modelle',
      stat2Label: 'Schnellster 0-100',
      stat3Label: 'Spitzenleistung',
      rankedByTitle: 'Sortiert nach 0-100 km/h Beschleunigung',
      rankedBySubtitle: 'Reine Performance-PHEVs nach Sprintzeit sortiert',
      tableTitle: 'Schnellste PHEVs Beschleunigungstabelle',
      tableSubtitle: '0-100 km/h Zeiten, PS-Leistung und Höchstgeschwindigkeiten.'
    },
    pl: {
      badge: 'Królowie Przyspieszenia 0-100 km/h',
      heroTitle: 'Najszybciej przyspieszające',
      heroTitleGradient: 'Hybrydy PHEV w Europie',
      heroSubtitle: 'Najbardziej dynamiczne hybrydy plug-in łączące moc silnika spalinowego z natychmiastowym momentem obrotowym silnika elektrycznego.',
      stat1Label: 'Modele sportowe',
      stat2Label: 'Najlepszy czas 0-100',
      stat3Label: 'Maks. moc',
      rankedByTitle: 'Ranking według przyspieszenia 0-100 km/h',
      rankedBySubtitle: 'Zestawienie najszybszych hybryd plug-in dostępnych na rynku',
      tableTitle: 'Tabela przyspieszenia i mocy hybryd PHEV',
      tableSubtitle: 'Czasy 0-100 km/h, łączna moc w KM i prędkość maksymalna.'
    },
    fr: {
      badge: 'Les Rois du 0 à 100 km/h',
      heroTitle: 'Les PHEV aux',
      heroTitleGradient: 'Accélérations les Plus Vives',
      heroSubtitle: 'Découvrez les hybrides rechargeables les plus rapides d\'Europe alliant suralimentation et couple électrique instantané.',
      stat1Label: 'Modèles sport',
      stat2Label: 'Meilleur 0-100',
      stat3Label: 'Puissance max',
      rankedByTitle: 'Classés par temps de 0 à 100 km/h',
      rankedBySubtitle: 'Les PHEV haute performance classés par vivacité d\'accélération',
      tableTitle: 'Tableau des accélérations et puissances PHEV',
      tableSubtitle: 'Temps de 0 à 100 km/h, puissance cumulée et vitesses de pointe.'
    },
    es: {
      badge: 'Líderes de 0 a 100 km/h',
      heroTitle: 'Los PHEV con',
      heroTitleGradient: 'Aceleración Más Rápida de Europa',
      heroSubtitle: 'Descubra los híbridos enchufables más rápidos del continente con potencia instantánea y prestaciones deportivas.',
      stat1Label: 'Modelos deportivos',
      stat2Label: 'Mejor 0-100',
      stat3Label: 'Potencia máx.',
      rankedByTitle: 'Ordenados por tiempo de aceleración 0-100 km/h',
      rankedBySubtitle: 'Híbridos enchufables de altas prestaciones ordenados por aceleración',
      tableTitle: 'Tabla comparativa de aceleración y potencia',
      tableSubtitle: 'Cifras de 0 a 100 km/h, caballos de fuerza combinados y velocidad punta.'
    }
  },
  '7-seater-phev': {
    en: {
      badge: '3-Row Seating (7 Passengers)',
      heroTitle: '7-Seater Family',
      heroTitleGradient: 'PHEVs in Europe',
      heroSubtitle: 'Explore spacious 3-row SUVs and MPVs with 7 seats, zero pure-electric range anxiety for school runs, and cavernous boot space for family holidays.',
      stat1Label: '7-Seaters',
      stat2Label: 'Max Seats',
      stat3Label: 'Up to Range',
      rankedByTitle: 'Ranked by Electric Range & Space',
      rankedBySubtitle: 'All genuine 7-passenger plug-in hybrid SUVs and minivans available in Europe',
      tableTitle: '7-Seater PHEV Comparison Table',
      tableSubtitle: 'Compare seat layouts, boot volume, battery capacity, and pure electric range.'
    },
    tr: {
      badge: '3 Sıra Koltuk (7 Kişilik)',
      heroTitle: '7 Koltuklu',
      heroTitleGradient: 'Aile PHEV\'leri (Avrupa)',
      heroSubtitle: 'Geniş aileler için 7 koltuklu, 3 sıra oturma düzenine sahip, şehir içi sıfır yakıt tüketimli ve devasa bagaj hacimli plug-in hibrit SUV ve MPV modellerini inceleyin.',
      stat1Label: '7 Koltuklu Model',
      stat2Label: 'Koltuk Sayısı',
      stat3Label: 'Maks. Menzil',
      rankedByTitle: 'Elektrikli Menzil ve Alana Göre Sıralı',
      rankedBySubtitle: 'Avrupa\'da satışta olan tüm gerçek 7 yolcu kapasiteli plug-in hibrit modeller',
      tableTitle: '7 Koltuklu PHEV Karşılaştırma Tablosu',
      tableSubtitle: 'Koltuk düzeni, bagaj hacmi ve elektrikli menzil karşılaştırması.'
    },
    de: {
      badge: '3 Sitzreihen (7 Personen)',
      heroTitle: '7-Sitzer Familien-',
      heroTitleGradient: 'PHEVs in Europa',
      heroSubtitle: 'Geräumige 7-Sitzer-SUVs und Vans mit 3 Sitzreihen für die ganze Familie mit rein elektrischem Alltagsbetrieb.',
      stat1Label: '7-Sitzer',
      stat2Label: 'Max. Sitze',
      stat3Label: 'Bis zu Reichweite',
      rankedByTitle: 'Sortiert nach E-Reichweite & Raumangebot',
      rankedBySubtitle: 'Alle echten 7-Personen Plug-in-Hybride in Europa',
      tableTitle: '7-Sitzer PHEV Übersichtstabelle',
      tableSubtitle: 'Sitzkonfigurationen, Kofferraumvolumen und Reichweiten im Vergleich.'
    },
    pl: {
      badge: '3 rzędy siedzeń (7 miejsc)',
      heroTitle: '7-Miejscowe Rodzinne',
      heroTitleGradient: 'Hybrydy PHEV w Europie',
      heroSubtitle: 'Przestronne SUV-y i vany z 7 miejscami siedzącymi, bez obawy o zasięg i z potężną przestrzenią bagażową na rodzinne wyjazdy.',
      stat1Label: 'Modele 7-miejscowe',
      stat2Label: 'Maks. miejsc',
      stat3Label: 'Zasięg do',
      rankedByTitle: 'Ranking według zasięgu EV i przestrzeni',
      rankedBySubtitle: 'Wszystkie 7-osobowe hybrydy plug-in na rynku europejskim',
      tableTitle: 'Tabela porównawcza 7-miejscowych hybryd PHEV',
      tableSubtitle: 'Układ foteli, pojemność bagażnika i parametry baterii.'
    },
    fr: {
      badge: '3 rangées de sièges (7 places)',
      heroTitle: 'Les PHEV Familiaux',
      heroTitleGradient: '7 Places en Europe',
      heroSubtitle: 'Découvrez les grands SUV et monospaces 7 places pour voyager en famille en tout confort sans émission au quotidien.',
      stat1Label: 'Modèles 7 places',
      stat2Label: 'Places assises',
      stat3Label: 'Jusqu\'à d\'autonomie',
      rankedByTitle: 'Classés par autonomie électrique et habitabilité',
      rankedBySubtitle: 'Tous les modèles hybrides rechargeables 7 places en Europe',
      tableTitle: 'Tableau des PHEV 7 places',
      tableSubtitle: 'Configuration des sièges, volume de coffre et caractéristiques batterie.'
    },
    es: {
      badge: '3 filas de asientos (7 plazas)',
      heroTitle: 'PHEV Familiares de',
      heroTitleGradient: '7 Plazas en Europa',
      heroSubtitle: 'Espaciosos SUV y monovolúmenes de 7 plazas ideales para familias numerosas con etiqueta CERO y gran maletero.',
      stat1Label: 'Modelos 7 plazas',
      stat2Label: 'Plazas máx.',
      stat3Label: 'Hasta de autonomía',
      rankedByTitle: 'Ordenados por autonomía eléctrica y espacio',
      rankedBySubtitle: 'Todos los híbridos enchufables de 7 plazas disponibles en Europa',
      tableTitle: 'Tabla comparativa de PHEV de 7 plazas',
      tableSubtitle: 'Configuración de asientos, capacidad de maletero y autonomía eléctrica.'
    }
  }
}

export function getCategoryLang(langParam?: string): CategoryLang {
  if (langParam && ['en', 'de', 'tr', 'pl', 'fr', 'es'].includes(langParam)) {
    return langParam as CategoryLang
  }
  return 'en'
}
