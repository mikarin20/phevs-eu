'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import RangeSimulator from '@/components/RangeSimulator'
import {
  SparklesIcon,
  BoltIcon,
  SunIcon,
  FireIcon,
  BanknotesIcon,
  ClockIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import PHEVRouteSimulator from '@/components/PHEVRouteSimulator'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  ev_range_km: number
  battery_kwh: number
  price_eur?: number
  image_url: string
  slug?: string
  battery_chemistry?: string
  simulator_data?: any
  charging_capabilities?: {
    ac_power?: number
    dc_power?: number
  }
}

interface Props {
  cars: Car[]
  initialCarId?: string
}

const UI_TEXT: Record<string, {
  badge: string
  title: string
  subtitle: string
  breadcrumbHome: string
  breadcrumbTools: string
  breadcrumbCurrent: string
  langSelect: string
  routeTabTitle: string
  routeTabBadge: string
  parametricTabTitle: string
  physicsTitle: string
  physicsSubtitle: string
  tempCardTitle: string
  tempCardDesc: string
  speedCardTitle: string
  speedCardDesc: string
  preconCardTitle: string
  preconCardDesc: string
  sohCardTitle: string
  sohCardDesc: string
  techTitle: string
  techSubtitle: string
  chemLfpTitle: string
  chemLfpDesc: string
  chemNmcTitle: string
  chemNmcDesc: string
  dhtTitle: string
  dhtDesc: string
  p2Title: string
  p2Desc: string
  benchmarksTitle: string
  benchmarksSubtitle: string
  simulateBtn: string
  faqTitle: string
  faqSubtitle: string
  exploreMoreTitle: string
}> = {
  en: {
    badge: 'Interactive Real-World Tool 2026',
    title: 'PHEV Real-World Range & Savings Calculator',
    subtitle: 'Discover how ambient temperature, motorway cruising speed, cabin heating, and battery health impact your actual electric kilometers and charging savings.',
    breadcrumbHome: 'Home',
    breadcrumbTools: 'Tools',
    breadcrumbCurrent: 'Range Calculator',
    langSelect: 'Language',
    routeTabTitle: 'Route-Based Journey Simulator (A → B)',
    routeTabBadge: 'New',
    parametricTabTitle: 'Parametric Physics Simulator',
    physicsTitle: 'Why Real-World PHEV Range Differs from WLTP',
    physicsSubtitle: 'Official laboratory WLTP tests are conducted at a flat 23°C in climate-controlled test dynamometers. On European roads, physical forces dictate your true daily range.',
    tempCardTitle: 'Winter Temperatures & Electrolyte Viscosity',
    tempCardDesc: 'Below 0°C, liquid electrolytes thicken and high-voltage PTC heaters consume 2-4 kW, cutting cold-start pure electric range by 25% to 35%.',
    speedCardTitle: 'Aerodynamic Drag at 120-140 km/h',
    speedCardDesc: 'Air resistance scales quadratically with speed (Fd ∝ v²). Cruising at 140 km/h increases aerodynamic drag by ~35% compared to 100 km/h, reducing range.',
    preconCardTitle: 'Pre-Conditioning on Grid Power',
    preconCardDesc: 'Warming or cooling the cabin while connected to a wallbox draws energy from the home grid instead of the vehicle battery, recovering 15% to 20% range.',
    sohCardTitle: 'Used Car Battery State of Health (SOH)',
    sohCardDesc: 'A 3-4 year old vehicle typically retains 90% to 92% usable battery capacity. Model exact degradation before purchasing a second-hand plug-in hybrid.',
    techTitle: 'Battery Chemistry & Transmission Architecture Dynamics',
    techSubtitle: 'How LFP vs NMC cell chemistry and P2 e-DSG vs P1+P3 DHT drivetrains change real-world range.',
    chemLfpTitle: 'LFP (Lithium Iron Phosphate) - BYD, Jaecoo, Chery',
    chemLfpDesc: 'Exceptional 3,000+ cycle life with near-zero degradation over 4 years (94% retained SOH). Electrolyte thickens faster at sub-zero cold without pre-heating, but recovers up to 65% when pre-conditioned.',
    chemNmcTitle: 'NMC (Nickel Manganese Cobalt) - VAG, BMW, Mercedes',
    chemNmcDesc: 'Higher gravimetric energy density and stable sub-zero cold discharge down to -10°C. Standard 1,000-1,500 cycle lifespan with normal ~10% degradation over 3-4 years.',
    dhtTitle: 'P1+P3 DHT Super Hybrid (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Dedicated Hybrid Transmission runs in direct electric or series mode without mechanical transmission friction, unlocking +12% higher regenerative recovery in urban stop-and-go.',
    p2Title: 'P2 Parallel Architecture (VAG e-DSG, BMW ZF)',
    p2Desc: 'Electric motor is integrated between engine and gearbox. Long overdrive mechanical ratios (6th-8th gear) maintain high efficiency at 130-140 km/h motorway cruising.',
    benchmarksTitle: 'Popular European PHEVs Benchmark',
    benchmarksSubtitle: 'Compare catalog WLTP ratings against expected real-world range across bestselling models.',
    simulateBtn: 'Simulate Model',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about plug-in hybrid electric range and daily charging.',
    exploreMoreTitle: 'Explore More PHEV Categories'
  },
  de: {
    badge: 'Interaktives Alltags-Tool 2026',
    title: 'PHEV Reale Reichweite & Ersparnis-Rechner',
    subtitle: 'Berechnen Sie, wie Außentemperatur, Autobahntempo, Heizung und Batteriegesundheit Ihre echte elektrische Reichweite und Ladekosten beeinflussen.',
    breadcrumbHome: 'Startseite',
    breadcrumbTools: 'Rechner',
    breadcrumbCurrent: 'Reichweitenrechner',
    langSelect: 'Sprache',
    routeTabTitle: 'Routen-Simulator (A → B)',
    routeTabBadge: 'Neu',
    parametricTabTitle: 'Parametrischer Physik-Simulator',
    physicsTitle: 'Warum reale Reichweiten vom WLTP abweichen',
    physicsSubtitle: 'Offizielle WLTP-Prüfstandstests finden bei 23°C ohne Klimaanlage statt. Im realen Fahrbetrieb bestimmen Physik und Thermodynamik den Verbrauch.',
    tempCardTitle: 'Kälte & zähe Batterie-Elektrolyte',
    tempCardDesc: 'Bei Minustemperaturen steigt der Innenwiderstand der Zellen und elektrische PTC-Zuheizer verbrauchen viel Strom. Reichweiten sinken um 20% bis 35%.',
    speedCardTitle: 'Luftwiderstand bei Autobahntempo',
    speedCardDesc: 'Der Luftwiderstand wächst quadratisch zur Geschwindigkeit. Bei 140 km/h steigt der Verbrauch drastisch gegenüber gemächlichen 100 km/h.',
    preconCardTitle: 'Vorklimatisierung am Stromnetz',
    preconCardDesc: 'Wer das Auto vor Fahrtantritt an der Wallbox vorheizt oder vorkühlt, schont die Batterie und sichert bis zu 20% mehr Reichweite.',
    sohCardTitle: 'Gebrauchtwagen-Batteriezustand (SOH)',
    sohCardDesc: 'Nach 3 bis 4 Jahren liegt der SOH oft bei 88% bis 92%. Simulieren Sie realistische Reichweiten vor dem Kauf eines gebrauchten Plug-in-Hybrids.',
    techTitle: 'Batteriechemie & Hybrid-Antriebsarchitektur im Detail',
    techSubtitle: 'Wie sich LFP vs. NMC-Zellen sowie P2-Parallel-Getriebe vs. P1+P3-DHT auf den Praxisverbrauch auswirken.',
    chemLfpTitle: 'LFP (Lithium-Eisenphosphat) - BYD, Jaecoo, Chery',
    chemLfpDesc: 'Überragende Zyklenfestigkeit (3.000+ Zyklen) und minimale Alterung nach 4 Jahren (94% SOH). Bei Frost unter 0°C jedoch höherer Innenwiderstand ohne Vorkonditionierung.',
    chemNmcTitle: 'NMC (Nickel-Mangan-Cobalt) - VAG, BMW, Mercedes',
    chemNmcDesc: 'Höhere Energiedichte und stabilere Kaltstart-Entladung bei winterlichen Minusgraden. Standardmäßige Alterung auf ca. 90% SOH nach 3-4 Jahren.',
    dhtTitle: 'P1+P3 DHT Super-Hybrid (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Getriebelose elektrische Direkt- und Serienschaltung ohne Reibungsverluste mechatronischer Schaltstufen, bringt bis zu +12% höhere Rekuperationseffizienz im Stadtverkehr.',
    p2Title: 'P2-Parallelarchitektur (VAG e-DSG, BMW ZF)',
    p2Desc: 'E-Maschine vor dem Mehrganggetriebe. Lange Overdrive-Gänge (6. bis 8. Stufe) halten die Drehzahl und den Verbrauch bei 130–140 km/h Autobahntempo niedrig.',
    benchmarksTitle: 'Beliebte Modelle im Praxisvergleich',
    benchmarksSubtitle: 'WLTP-Katalogwert vs. realistische Reichweite bei europäischen Bestsellern.',
    simulateBtn: 'Dieses Modell simulieren',
    faqTitle: 'Häufig gestellte Fragen (FAQ)',
    faqSubtitle: 'Alles, was Sie über elektrische Reichweiten und Ladezeiten bei Plug-in-Hybriden wissen müssen.',
    exploreMoreTitle: 'Weitere PHEV-Kategorien entdecken'
  },
  tr: {
    badge: 'Gerçek Yol Şartları Simülatörü 2026',
    title: 'PHEV Gerçek Menzil & Yakıt Tasarrufu Hesaplayıcı',
    subtitle: 'Hava sıcaklığı, otoyol seyir hızı, klima kullanımı ve batarya sağlığının elektrikli menzilinize ve benzin tasarrufunuza etkisini anında hesaplayın.',
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbTools: 'Araçlar',
    breadcrumbCurrent: 'Menzil Hesaplayıcı',
    langSelect: 'Dil',
    routeTabTitle: 'Rota Tabanlı Yolculuk Simülatörü (A → B)',
    routeTabBadge: 'Yeni',
    parametricTabTitle: 'Parametrik Fizik Simülatörü',
    physicsTitle: 'Gerçek Menzil Neden Fabrika WLTP Değerinden Farklıdır?',
    physicsSubtitle: 'Resmi WLTP testleri 23°C sabit laboratuvar ortamında klimasız yapılır. Gerçek yollarda hava şartları, aerodinamik rüzgar direnci ve ısıtma devreye girer.',
    tempCardTitle: 'Kış Sıcaklığı ve Donan Hücreler',
    tempCardDesc: 'Sıfırın altındaki derecelerde batarya elektroliti yoğunlaşır ve elektrikli rezistanslar (PTC) saatte 2-4 kWh çekerek kış menzilini %25-%35 oranında düşürür.',
    speedCardTitle: 'Otoyol Hızı ve Aerodinamik Sürtünme',
    speedCardDesc: 'Hava direnci hızın karesiyle artar (Fd ∝ v²). 140 km/s hızla seyretmek, 100 km/s hıza göre rüzgar direncini iki katına yaklaştırarak bataryayı hızla tüketir.',
    preconCardTitle: 'Kabloya Takılıyken Ön İklimlendirme',
    preconCardDesc: 'Aracınızı evde prize takılıyken telefon uygulamasından ısıtıp/soğutursanız, enerji bataryadan değil şebekeden çekilir ve yola %15-%20 ekstra menzille başlarsınız.',
    sohCardTitle: 'İkinci El Batarya Sağlığı (SOH)',
    sohCardDesc: '3-4 yaşındaki bir PHEV aracın batarya sağlığı genellikle %88-%92 bandına iner. İkinci el alım öncesi gerçek menzil kapasitesini önceden test edin.',
    techTitle: 'Batarya Kimyası ve Hibrit Şanzıman Mimarisi Farkı',
    techSubtitle: 'LFP ve NMC bataryalar ile P2 e-DSG ve Jaecoo P1+P3 DHT süper hibrit sistemlerinin menzile doğrudan etkileri.',
    chemLfpTitle: 'LFP (Lityum Demir Fosfat) - BYD, Jaecoo, Chery',
    chemLfpDesc: '3.000+ şarj döngüsü ömrü ve yüksek termal güvenlik. 4 yılda bile pil sağlığı (SOH) %94 seviyesinde kalır. Ancak 0°C altındaki dondurucu havalarda ön ısıtmasızken elektrolit direnci daha fazladır.',
    chemNmcTitle: 'NMC (Nikel Manganez Kobalt) - VW Grubu, BMW, Mercedes',
    chemNmcDesc: 'Yüksek enerji yoğunluğu ve kışın dondurucu soğuklarda daha az voltaj düşüşü sağlar. Döngü ömrü 1.000-1.500 civarındadır; 3-4 yılda yaklaşık %10 kapasite kaybı yaşanır.',
    dhtTitle: 'P1+P3 DHT Süper Hibrit (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Geleneksel dişli kutusu sürtünmesi olmadan doğrudan elektrikli/seri sürüş sunar. Şehir içi dur-kalklarda rejeneratif frenleme geri kazanımı (+%12) çok daha verimlidir.',
    p2Title: 'P2 Paralel Mimari (VAG e-DSG, BMW ZF)',
    p2Desc: 'Elektrik motoru şanzıman girişine entegredir. Çok kademeli mekanik vites oranları (6-8. vites) sayesinde 130-140 km/s otoyol hızlarında motor devrini düşük tutarak yüksek verim sağlar.',
    benchmarksTitle: 'Popüler PHEV Modellerinin Karşılaştırması',
    benchmarksSubtitle: 'Avrupa ve Türkiye pazarında en çok satan modellerin WLTP ve gerçek yol menzilleri.',
    simulateBtn: 'Bu Modeli Hesapla',
    faqTitle: 'Sıkça Sorulan Sorular',
    faqSubtitle: 'Plug-in hibrit menzili, evde şarj maliyeti ve tasarruf hesabı hakkında merak edilenler.',
    exploreMoreTitle: 'Diğer PHEV Sayfalarımızı Keşfedin'
  },
  pl: {
    badge: 'Interaktywny Symulator Zasięgu 2026',
    title: 'Kalkulator Realnego Zasięgu & Oszczędności PHEV',
    subtitle: 'Sprawdź, jak temperatura zewnętrzna, prędkość autostradowa, klimatyzacja i zużycie baterii wpływają na Twój zasięg elektryczny i koszty paliwa.',
    breadcrumbHome: 'Główna',
    breadcrumbTools: 'Narzędzia',
    breadcrumbCurrent: 'Kalkulator Zasięgu',
    langSelect: 'Język',
    routeTabTitle: 'Symulator trasy podróży (A → B)',
    routeTabBadge: 'Nowość',
    parametricTabTitle: 'Parametryczny symulator fizyki',
    physicsTitle: 'Dlaczego zasięg katalogowy WLTP różni się od realnego?',
    physicsSubtitle: 'Oficjalne testy WLTP odbywają się w temperaturze 23°C na hamowni laboratoryjnej. Na drodze opór powietrza i ogrzewanie weryfikują dane.',
    tempCardTitle: 'Zimowe mrozy i opór elektrolitu',
    tempCardDesc: 'W temperaturach poniżej 0°C opór wewnętrzny ogniw wzrasta, a nagrzewnice PTC zużywają 2-4 kW, obniżając zasięg o 25% do 35%.',
    speedCardTitle: 'Opór aerodynamiczny przy 120-140 km/h',
    speedCardDesc: 'Opór powietrza rośnie z kwadratem prędkości. Jazda autostradą z prędkością 140 km/h drastycznie podnosi zużycie energii w porównaniu do 100 km/h.',
    preconCardTitle: 'Wstępne nagrzewanie z sieci domowej',
    preconCardDesc: 'Podgrzanie kabiny podłączonego auta pozwala pobrać energię bezpośrednio z gniazdka, zachowując 100% energii baterii na jazdę.',
    sohCardTitle: 'Kondycja baterii w autach używanych (SOH)',
    sohCardDesc: '3-4 letnia hybryda ma zwykle około 90% pierwotnej pojemności. Sprawdź realne możliwości auta przed zakupem na rynku wtórnym.',
    techTitle: 'Wpływ chemii baterii i architektury napędu hybrydowego',
    techSubtitle: 'Jak ogniwa LFP vs NMC oraz skrzynie P2 e-DSG vs P1+P3 DHT kształtują zużycie energii.',
    chemLfpTitle: 'LFP (Litowo-żelazowo-fosforanowe) - BYD, Jaecoo, Chery',
    chemLfpDesc: 'Żywotność ponad 3000 cykli i minimalna degradacja po 4 latach (94% SOH). Zimą poniżej 0°C elektrolit stawia jednak większy opór bez wstępnego nagrzania.',
    chemNmcTitle: 'NMC (Niklowo-manganowo-kobaltowe) - VAG, BMW, Mercedes',
    chemNmcDesc: 'Wyższa gęstość energii i lepsza wydajność rozładowania w temperaturach ujemnych. Standardowa degradacja do ok. 90% pojemności po 3-4 latach.',
    dhtTitle: 'P1+P3 DHT Super Hybrid (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Napęd szeregowo-równoległy bez tradycyjnych strat tarcia w skrzyni biegów; do 12% wyższy odzysk energii z hamowania w mieście.',
    p2Title: 'Architektura P2 Parallel (VAG e-DSG, BMW ZF)',
    p2Desc: 'Silnik elektryczny zintegrowany ze skrzynią biegów. Długie przełożenia autostradowe (6-8 bieg) gwarantują wysoką efektywność przy 130-140 km/h.',
    benchmarksTitle: 'Porównanie popularnych modeli hybrydowych',
    benchmarksSubtitle: 'Zasięg katalogowy WLTP a realne wyniki na drodze.',
    simulateBtn: 'Symuluj ten model',
    faqTitle: 'Często zadawane pytania (FAQ)',
    faqSubtitle: 'Wszystko o zasięgu elektrycznym, ładowaniu i oszczędnościach.',
    exploreMoreTitle: 'Zobacz inne kategorie hybryd plug-in'
  },
  fr: {
    badge: 'Outil interactif en conditions réelles 2026',
    title: 'Simulateur d’autonomie réelle & Économies PHEV',
    subtitle: 'Découvrez l’impact de la température ambiante, de la vitesse sur autoroute, du chauffage et de la santé de batterie sur votre autonomie électrique réelle.',
    breadcrumbHome: 'Accueil',
    breadcrumbTools: 'Outils',
    breadcrumbCurrent: 'Calculateur d’autonomie',
    langSelect: 'Langue',
    routeTabTitle: 'Simulateur d’itinéraire réel (A → B)',
    routeTabBadge: 'Nouveau',
    parametricTabTitle: 'Simulateur physique paramétrique',
    physicsTitle: 'Pourquoi l’autonomie réelle diffère-t-elle du WLTP ?',
    physicsSubtitle: 'Les tests officiels WLTP sont réalisés à 23°C en laboratoire climatisé. Sur route, les contraintes physiques déterminent votre autonomie réelle.',
    tempCardTitle: 'Températures hivernales et viscosité des cellules',
    tempCardDesc: 'En dessous de 0°C, les électrolytes s’épaississent et les chauffages PTC consomment 2 à 4 kW, réduisant l’autonomie électrique de 25% à 35%.',
    speedCardTitle: 'Résistance aérodynamique à 120-140 km/h',
    speedCardDesc: 'La traînée aérodynamique croît au carré de la vitesse (Fd ∝ v²). Rouler à 140 km/h augmente la résistance d’environ 35% par rapport à 100 km/h.',
    preconCardTitle: 'Préconditionnement sur le réseau électrique',
    preconCardDesc: 'Préchauffer l’habitacle pendant la recharge tire l’énergie de la prise murale plutôt que de la batterie, récupérant 15% à 20% d’autonomie.',
    sohCardTitle: 'Santé de la batterie d’occasion (SOH)',
    sohCardDesc: 'Un véhicule de 3 à 4 ans conserve généralement 90% à 92% de sa capacité utile. Évaluez la dégradation réelle avant d’acheter.',
    techTitle: 'Chimie de batterie & Dynamique d’architecture hybride',
    techSubtitle: 'Impact des cellules LFP vs NMC et des boîtes P2 e-DSG vs P1+P3 DHT sur la consommation réelle.',
    chemLfpTitle: 'LFP (Lithium Fer Phosphate) - BYD, Jaecoo, Chery',
    chemLfpDesc: 'Durée de vie supérieure à 3 000 cycles et dégradation minime sur 4 ans (94% SOH). Plus sensible au gel sans préconditionnement.',
    chemNmcTitle: 'NMC (Nickel Manganèse Cobalt) - VAG, BMW, Mercedes',
    chemNmcDesc: 'Densité énergétique plus élevée et décharge stable sous 0°C. Dégradation normale à environ 90% après 3-4 ans.',
    dhtTitle: 'DHT Super Hybride P1+P3 (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Transmission sans frottement mécanique d’embrayage traditionnel; récupération d’énergie au freinage urbain supérieure de +12%.',
    p2Title: 'Architecture parallèle P2 (VAG e-DSG, BMW ZF)',
    p2Desc: 'Moteur électrique intégré avant la boîte de vitesses. Rapports longs d’autoroute maintenant une excellente efficacité à 130-140 km/h.',
    benchmarksTitle: 'Comparatif des modèles PHEV populaires',
    benchmarksSubtitle: 'Homologation WLTP vs autonomie réelle attendue sur les best-sellers européens.',
    simulateBtn: 'Simuler ce modèle',
    faqTitle: 'Foire aux questions (FAQ)',
    faqSubtitle: 'Tout ce que vous devez savoir sur l’autonomie et la recharge des hybrides rechargeables.',
    exploreMoreTitle: 'Explorer d’autres catégories PHEV'
  },
  es: {
    badge: 'Herramienta interactiva en condiciones reales 2026',
    title: 'Calculadora de autonomía real y ahorro PHEV',
    subtitle: 'Compruebe cómo la temperatura ambiente, la velocidad en autopista, la calefacción y la salud de la batería influyen en sus kilómetros eléctricos.',
    breadcrumbHome: 'Inicio',
    breadcrumbTools: 'Herramientas',
    breadcrumbCurrent: 'Calculadora de autonomía',
    langSelect: 'Idioma',
    routeTabTitle: 'Simulador de ruta punto a punto (A → B)',
    routeTabBadge: 'Nuevo',
    parametricTabTitle: 'Simulador físico paramétrico',
    physicsTitle: '¿Por qué la autonomía real difiere del ciclo WLTP?',
    physicsSubtitle: 'Los ensayos WLTP se realizan a 23°C en banco de pruebas sin climatizador. En carretera, la física y el clima dictan su autonomía real.',
    tempCardTitle: 'Temperaturas invernales y viscosidad química',
    tempCardDesc: 'Por debajo de 0°C, el electrolito se espesa y las resistencias PTC consumen 2-4 kW, recortando la autonomía eléctrica entre un 25% y un 35%.',
    speedCardTitle: 'Resistencia aerodinámica a 120-140 km/h',
    speedCardDesc: 'La resistencia del aire crece con el cuadrado de la velocidad (Fd ∝ v²). Circular a 140 km/h aumenta drásticamente el consumo respecto a 100 km/h.',
    preconCardTitle: 'Preclimatización conectado a la red eléctrica',
    preconCardDesc: 'Calentar el habitáculo mientras está enchufado toma la energía de la toma doméstica en lugar de la batería, ganando un 15%-20% de autonomía.',
    sohCardTitle: 'Salud de batería en vehículos de ocasión (SOH)',
    sohCardDesc: 'Un PHEV de 3-4 años suele conservar un 90%-92% de capacidad útil. Simule la degradación real antes de comprar.',
    techTitle: 'Química de celda y arquitectura híbrida',
    techSubtitle: 'Cómo influyen las celdas LFP vs NMC y las transmisiones P2 vs P1+P3 DHT en el consumo diario.',
    chemLfpTitle: 'LFP (Fosfato de hierro y litio) - BYD, Jaecoo, Chery',
    chemLfpDesc: 'Más de 3.000 ciclos y degradación mínima tras 4 años (94% SOH). Mayor resistencia interna bajo cero sin precalentamiento.',
    chemNmcTitle: 'NMC (Níquel Manganeso Cobalto) - VAG, BMW, Mercedes',
    chemNmcDesc: 'Mayor densidad energética y descarga estable en invierno. Degradación estándar a aprox. 90% de capacidad tras 3-4 años.',
    dhtTitle: 'P1+P3 DHT Super Híbrido (Jaecoo, Chery, BYD DM-i)',
    dhtDesc: 'Transmisión híbrida dedicada sin pérdidas de fricción de cambio tradicional; hasta un +12% más de recuperación regenerativa urbana.',
    p2Title: 'Arquitectura paralela P2 (VAG e-DSG, BMW ZF)',
    p2Desc: 'Motor eléctrico integrado en la caja de cambios. Desarrollos largos de autopista para mantener alta eficiencia a 130-140 km/h.',
    benchmarksTitle: 'Comparativa de híbridos enchufables populares',
    benchmarksSubtitle: 'Catálogo WLTP frente a autonomía real esperada en los modelos más vendidos.',
    simulateBtn: 'Simular este modelo',
    faqTitle: 'Preguntas frecuentes (FAQ)',
    faqSubtitle: 'Todo lo que necesita saber sobre autonomía, recarga y ahorro de un híbrido enchufable.',
    exploreMoreTitle: 'Explorar más categorías PHEV'
  }
}

const FAQS = [
  {
    q_en: 'How accurate is this PHEV Range Simulator compared to official WLTP ratings?',
    a_en: 'Our simulator builds upon official UNECE WLTP test-bench data and applies validated thermodynamic and aerodynamic equations (temperature efficiency curves, quadratic aerodynamic drag, PTC cabin heating draw, and battery SOH degradation). While actual driving varies by terrain and traffic, our simulator matches real-world European highway and commuting tests within ±5-8%.',
    q_de: 'Wie genau ist dieser Simulator im Vergleich zu den offiziellen WLTP-Angaben?',
    a_de: 'Unser Simulator nutzt offizielle WLTP-Verbrauchsdaten und ergänzt sie durch aerodynamische und thermodynamische Berechnungsmodelle (Luftwiderstand bei Reisetempo, Innenraum-Heizlast, Batterie-SOH). In Praxistests liegt die Genauigkeit bei ±5 bis 8% der tatsächlichen Reichweite.',
    q_tr: 'Bu menzil simülatörü fabrika WLTP verilerine kıyasla ne kadar güvenilirdir?',
    a_tr: 'Simülatörümüz resmi UNECE WLTP laboratuvar verilerini temel alır ve aerodinamik sürtünme katsayıları, kış sıcaklık eğrileri, klima/PTC ısıtıcı yükü ve batarya sağlık (SOH) katsayılarını uygular. Gerçek yol testlerinde sapma oranı yalnızca ±%5-8 aralığındadır.',
    q_pl: 'Jak dokładny jest ten kalkulator w porównaniu do danych katalogowych WLTP?',
    a_pl: 'Kalkulator łączy oficjalne dane laboratoryjne WLTP z modelami oporu aerodynamicznego, poboru mocy przez ogrzewanie kabiny oraz temperaturą zewnętrzną, zapewniając zgodność z realnymi testami drogowymi na poziomie ±5-8%.'
  },
  {
    q_en: 'How much money do I save on fuel by charging a PHEV at home?',
    a_en: 'Charging at home is typically 2.5 to 3.5 times cheaper per kilometer than petrol. For example, fully charging a 15 kWh battery at €0.28/kWh costs ~€4.20, providing ~60 km of range. Driving the same distance on petrol in a 7.5 L/100km SUV costs ~€8.00. This delivers net savings of €3.80 per full charge and over €950 annually for daily commuters.',
    q_de: 'Wie viel Geld spare ich pro Ladung im Vergleich zu Benzin?',
    a_de: 'Das Laden zu Hause ist pro Kilometer ca. 2,5 bis 3,5 Mal günstiger als Benzin. Eine 15-kWh-Batterieladung bei 0,36 €/kWh kostet ca. 5,40 € für 60 km. Auf Benzin (7,5 L/100km bei 1,82 €/L) kostet die gleiche Strecke ca. 8,20 €. Das spart rund 2,80 € pro Ladung und knapp 1.000 € pro Jahr.',
    q_tr: 'Evde şarj ederek benzinli bir araca göre ne kadar tasarruf ederim?',
    a_tr: 'Ev elektriği ile şarj etmek kilometre başına benzinli sürüşe göre 3 ila 4 kat daha ekonomiktir. 15 kWh bataryayı evden 2,60 ₺/kWh ile doldurmak ~39 ₺ tutarken, 60 km rotayı 7,5 L/100km yakan benzinli bir SUV ile gitmek ~200 ₺ yakıt harcar. Her tam şarjda ~160 ₺ net tasarruf sağlanır; yılda ~28.000 ₺ cepte kalır.',
    q_pl: 'Ile oszczędzam na paliwie ładując hybrydę w domu?',
    a_pl: 'Jazda na prądzie ładowanym w taryfie domowej (G11 ~1,15 zł/kWh) jest trzykrotnie tańsza niż na benzynie. Pełne naładowanie baterii 15 kWh to koszt ok. 17,25 zł na 60 km. Ta sama trasa na benzynie Pb95 to wydatek rzędu 29,70 zł, co daje ponad 2.000 zł rocznych oszczędności.'
  },
  {
    q_en: 'Why does electric range drop significantly in winter temperatures?',
    a_en: 'Lithium-ion batteries operate via liquid electrolyte chemical transfers that slow down below 10°C, increasing internal resistance. Additionally, unlike petrol engines which produce copious waste heat, electric powertrains must heat the passenger cabin using high-voltage PTC resistance heaters or heat pumps drawing 2,000 to 4,000 Watts continuously.',
    q_de: 'Warum sinkt die elektrische Reichweite im Winter so stark?',
    a_de: 'Bei Minusgraden wird der flüssige Elektrolyt in den Batteriezellen zähflüssiger, was den Innenwiderstand erhöht. Zudem muss die Innenraumheizung ohne Motorwärme elektrisch betrieben werden und verbraucht 2 bis 4 kW Dauerleistung aus der Hochvoltbatterie.',
    q_tr: 'Kış aylarında elektrikli menzil neden bu kadar belirgin düşer?',
    a_tr: 'Lityum iyon bataryaların içindeki sıvı elektrolit sıfırın altındaki derecelerde yoğunlaşır ve iç direnç artar. Ayrıca içten yanmalı motorun atık ısısı olmadığı için kabin, bataryadan 2.000-4.000 Watt çeken elektrikli rezistanslarla (PTC) ısıtılır.',
    q_pl: 'Dlaczego zasięg na prądzie spada zimą o kilkadziesiąt procent?',
    a_pl: 'Poniżej zera elektrolit w ogniwach gęstnieje, zwiększając opór wewnętrzny. Dodatkowo elektryczne dogrzewacze wnętrza PTC pobierają stale 2-4 kW z baterii trakcyjnej.'
  },
  {
    q_en: 'Can I charge a plug-in hybrid using a standard household 2.3 kW socket?',
    a_en: 'Yes! All PHEVs in Europe can be charged safely from a standard 230V household Schuko socket (using the manufacturer-supplied Mode 2 emergency cable). Because PHEV batteries range between 12 kWh and 25 kWh, a full charge takes 6 to 10 hours—ideal for overnight charging while sleeping.',
    q_de: 'Kann ich einen Plug-in-Hybrid an einer normalen Haushaltssteckdose laden?',
    a_de: 'Ja. Alle europäischen PHEVs können mit dem beiliegenden Notladekabel an einer Standard-230V-Steckdose (2,3 kW Schuko) geladen werden. Eine Vollladung dauert je nach Akkugröße zwischen 6 und 10 Stunden und erfolgt bequem über Nacht.',
    q_tr: 'Plug-in hibrit bir aracı standart 220V ev prizinden şarj edebilir miyim?',
    a_tr: 'Evet! PHEV araçların tümü araçla gelen standart adaptörle 2,3 kW ev prizinden (Schuko) şarj edilebilir. Bataryaları 12-25 kWh arasında olduğu için 6 ila 10 saatte (gece siz uyurken) tamamen dolar; pahalı wallbox kurulumu zorunlu değildir.',
    q_pl: 'Czy mogę ładować hybrydę ze standardowego gniazdka 230V w garażu?',
    a_pl: 'Tak, każda hybryda plug-in jest fabrycznie wyposażona w kabel do ładowania z gniazdka 2,3 kW. Bateria o pojemności 12-20 kWh ładuje się w 6-9 godzin, czyli w trakcie nocnego postoju.'
  }
]

function RangeCalculatorContent({ cars, initialCarId }: Props) {
  // Language management
  const [locale, setLocale] = useState<string>('en')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('phevs-language') || 'en'
      setLocale(stored)
    }

    const onLangChange = (e: any) => {
      if (e.detail?.language) {
        setLocale(e.detail.language)
      }
    }
    window.addEventListener('languageChanged', onLangChange)
    return () => window.removeEventListener('languageChanged', onLangChange)
  }, [])

  const handleLanguageChange = (code: string) => {
    setLocale(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('phevs-language', code)
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: code } }))
    }
  }

  // Pre-select car based on initialCarId prop or default to popular model
  const initialCar = useMemo(() => {
    if (initialCarId) {
      const found = cars.find(c => c.id === initialCarId || c.slug === initialCarId || c.id.includes(initialCarId))
      if (found) return found
    }
    return cars.find(c => c.id === 'peugeot-3008-phev' || c.id === 'toyota-prius-phev') || cars[0]
  }, [initialCarId, cars])

  const [activeCar, setActiveCar] = useState<Car>(initialCar)
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<'route' | 'parametric'>('route')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [initialParams, setInitialParams] = useState<{
    temp?: number
    ac?: boolean
    speed?: 100 | 120 | 140
    hwy?: number
    soh?: 100 | 90 | 80
    mode?: 'eco' | 'normal' | 'sport'
    precon?: boolean
  }>({})

  // Listen to client-side query string if loaded directly or on back/forward
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const paramCar = params.get('car')
      if (paramCar) {
        const found = cars.find(c => c.id === paramCar || c.slug === paramCar || c.id.includes(paramCar))
        if (found) {
          setActiveCar(found)
        }
      }

      const pTemp = params.get('temp') ? Number(params.get('temp')) : undefined
      const pAc = params.get('ac') !== null ? params.get('ac') === '1' : undefined
      const pSpeed = params.get('speed') ? Number(params.get('speed')) as (100 | 120 | 140) : undefined
      const pHwy = params.get('hwy') ? Number(params.get('hwy')) : undefined
      const pSoh = params.get('soh') ? Number(params.get('soh')) as (100 | 90 | 80) : undefined
      const pMode = params.get('mode') as ('eco' | 'normal' | 'sport') | null
      const pPrecon = params.get('precon') === '1'

      setInitialParams({
        temp: pTemp !== undefined && !isNaN(pTemp) ? pTemp : undefined,
        ac: pAc,
        speed: pSpeed && [100, 120, 140].includes(pSpeed) ? pSpeed : undefined,
        hwy: pHwy !== undefined && !isNaN(pHwy) ? pHwy : undefined,
        soh: pSoh && [100, 90, 80].includes(pSoh) ? pSoh : undefined,
        mode: pMode && ['eco', 'normal', 'sport'].includes(pMode) ? pMode : undefined,
        precon: pPrecon
      })
    }
  }, [cars])

  const t = UI_TEXT[locale] || UI_TEXT.en

  // Benchmark highlight cars
  const benchmarkModels = useMemo(() => {
    const slugs = [
      'byd-seal-u-dm-i-phev',
      'toyota-prius-phev',
      'peugeot-3008-phev',
      'volkswagen-tiguan-ehybrid-phev',
      'mercedes-benz-glc-300-e-4matic-phev',
      'bmw-x1-xdrive25e-phev',
      'volvo-xc60-recharge-t6-phev',
      'mg-hs-plug-in-hybrid-phev'
    ]
    return cars.filter(c => slugs.includes(c.id)).slice(0, 8)
  }, [cars])

  const handleSelectBenchmark = (car: Car) => {
    setActiveCar(car)
    if (typeof window !== 'undefined') {
      const targetSlug = car.slug || car.id
      window.history.replaceState(null, '', `?car=${targetSlug}`)
      window.scrollTo({ top: 180, behavior: 'smooth' })
    }
  }

  const handleSimulatorSelectCar = (car: Car) => {
    setActiveCar(car)
    if (typeof window !== 'undefined') {
      const targetSlug = car.slug || car.id
      window.history.replaceState(null, '', `?car=${targetSlug}`)
    }
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span>/</span>
          <span className="text-slate-400">{t.breadcrumbTools}</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{t.breadcrumbCurrent}</span>
        </nav>

        {/* Language selector toggle */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.langSelect}:</span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {[
              { code: 'en', flag: '🇬🇧 EN' },
              { code: 'de', flag: '🇩🇪 DE' },
              { code: 'tr', flag: '🇹🇷 TR' },
              { code: 'pl', flag: '🇵🇱 PL' },
              { code: 'fr', flag: '🇫🇷 FR' },
              { code: 'es', flag: '🇪🇸 ES' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  locale === lang.code
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs">
          <SparklesIcon className="h-4 w-4 text-blue-500 animate-pulse" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          {t.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center pt-2">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-inner max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSimulatorTab('route')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSimulatorTab === 'route'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPinIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.routeTabTitle}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30">
              {t.routeTabBadge}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSimulatorTab('parametric')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSimulatorTab === 'parametric'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{t.parametricTabTitle}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Embedded Range Simulator */}
      <section id="simulator-interactive" aria-label="Interactive Range Simulator">
        {activeSimulatorTab === 'route' ? (
          <PHEVRouteSimulator initialCarId={activeCar?.id} locale={locale} />
        ) : (
          <RangeSimulator
            key={`${activeCar?.id}-${initialParams.temp}-${initialParams.ac}`}
            isEmbedded={true}
            syncUrl={true}
            baseRange={activeCar?.ev_range_km || 100}
            batteryCapacity={activeCar?.battery_kwh || 18}
            selectedCar={activeCar}
            simulatorData={activeCar?.simulator_data}
            locale={locale}
            allCars={cars}
            onSelectCar={handleSimulatorSelectCar}
            initialTemp={initialParams.temp}
            initialAc={initialParams.ac}
            initialHighwayShare={initialParams.hwy}
            initialCruisingSpeed={initialParams.speed}
            initialDrivingMode={initialParams.mode}
            initialBatterySoh={initialParams.soh}
            initialPreConditioned={initialParams.precon}
          />
        )}
      </section>

      {/* Section 1: In-Depth Technical & Aerodynamic Guide */}
      <section className="space-y-6 pt-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.physicsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            {t.physicsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <SunIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.tempCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.tempCardDesc}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <BoltIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.speedCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.speedCardDesc}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <FireIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.preconCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.preconCardDesc}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.sohCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.sohCardDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Section 1.5: Battery Chemistry & Transmission Architecture Dynamics */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <CpuChipIcon className="h-4 w-4" />
            <span>Battery & Hybrid Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.techTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.techSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* LFP vs NMC Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔋</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  LFP vs NMC Chemistry
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                Cell Level
              </span>
            </div>

            {/* LFP Subsection */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {t.chemLfpTitle}
                </h4>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">3,000+ Cycles</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.chemLfpDesc}
              </p>
            </div>

            {/* NMC Subsection */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  {t.chemNmcTitle}
                </h4>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">High Density</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.chemNmcDesc}
              </p>
            </div>
          </div>

          {/* DHT vs P2 Parallel Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚙️</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  DHT vs P2 Architecture
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300">
                Powertrain
              </span>
            </div>

            {/* DHT Subsection */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  {t.dhtTitle}
                </h4>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">+12% Urban Regen</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.dhtDesc}
              </p>
            </div>

            {/* P2 Subsection */}
            <div className="p-3.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-900 dark:text-cyan-200">
                  {t.p2Title}
                </h4>
                <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">High-Speed Gear</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.p2Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Popular Models Benchmark Table */}
      {benchmarkModels.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t.benchmarksTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.benchmarksSubtitle}
              </p>
            </div>
            <Link
              href="/longest-range-phev"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>View all longest range models</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4 text-center">WLTP Range</th>
                  <th className="py-3 px-4 text-center">Winter ~0°C</th>
                  <th className="py-3 px-4 text-center">Highway ~120 km/h</th>
                  <th className="py-3 px-4 text-center">Battery</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-800 dark:text-slate-200">
                {benchmarkModels.map((car) => {
                  const isLfp = (car.battery_chemistry || '').toUpperCase().includes('LFP') || (car.brand || '').toLowerCase().includes('byd')
                  const isDht = (car.brand || '').toLowerCase().includes('jaecoo') || (car.brand || '').toLowerCase().includes('byd') || (car.brand || '').toLowerCase().includes('mg') || (car.brand || '').toLowerCase().includes('chery')
                  const winterFactor = isLfp ? 0.65 : 0.72
                  const highwayFactor = isDht ? 0.74 : 0.80
                  const estWinter = Math.round(car.ev_range_km * winterFactor)
                  const estHighway = Math.round(car.ev_range_km * highwayFactor)
                  return (
                    <tr key={car.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {car.brand} {car.model}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                        {car.ev_range_km} km
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                        ~{estWinter} km
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                        ~{estHighway} km
                      </td>
                      <td className="py-3 px-4 text-center">
                        {car.battery_kwh} kWh
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectBenchmark(car)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 transition-colors cursor-pointer"
                        >
                          {t.simulateBtn}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Section 3: Interactive FAQ Accordion */}
      <section className="space-y-5 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <QuestionMarkCircleIcon className="h-4 w-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            const question = (faq as any)[`q_${locale}`] || faq.q_en
            const answer = (faq as any)[`a_${locale}`] || faq.a_en

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <span className="pr-4">{question}</span>
                  <ChevronDownIcon className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 animate-in fade-in duration-150">
                    {answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 4: Related Links & Tools */}
      <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {t.exploreMoreTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/longest-range-phev"
            className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-xs transition-all group"
          >
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Rankings</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Longest Range PHEVs &rarr;
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Models with over 100+ km electric range</div>
          </Link>

          <Link
            href="/phev-with-dc-charging"
            className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-xs transition-all group"
          >
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Charging</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              PHEVs with DC Fast Charging &rarr;
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">CCS rapid charge under 30 minutes</div>
          </Link>

          <Link
            href="/tax-simulator"
            className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 shadow-xs transition-all group"
          >
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Fleet & Taxes</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
              Company Car & Tax Simulator &rarr;
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">UK BiK, German 0.5%, France Malus</div>
          </Link>

          <Link
            href="/compare"
            className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs transition-all group"
          >
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">Comparison</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              Compare Any 2 Models &rarr;
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Side-by-side technical specs</div>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function RangeCalculatorPageClient({ cars, initialCarId }: Props) {
  return <RangeCalculatorContent cars={cars} initialCarId={initialCarId} />
}
