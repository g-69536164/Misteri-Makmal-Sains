import { Station, StationId, ClueTerminal, QuizPuzzle, Achievement } from '../types/game';

export interface ScientificStepInfo {
  step: number;
  name: string;
  shortDesc: string;
  kssmKeyPoints: string[];
}

export const SCIENTIFIC_STEPS_INFO: ScientificStepInfo[] = [
  {
    step: 1,
    name: 'Mengenal Pasti Masalah',
    shortDesc: 'Menentukan persoalan saintifik yang hendak disiasat melalui pemerhatian teliti.',
    kssmKeyPoints: [
      'Penyiasatan saintifik bermula dengan membuat pemerhatian menggunakan deria.',
      'Persoalan saintifik mesti boleh diuji melalui eksperimen.',
      'Contoh persoalan: "Adakah panjang tali mempengaruhi tempoh satu ayunan lengkap bandul?"',
    ],
  },
  {
    step: 2,
    name: 'Membina Hipotesis',
    shortDesc: 'Membuat pernyataan awal yang menghubungkan pemboleh ubah untuk diuji.',
    kssmKeyPoints: [
      'Hipotesis ialah cadangan penerangan awal yang logik dan boleh diuji secara saintifik.',
      'Format lazim: "Semakin [PM], semakin [PB]" atau "Jika [PM] meningkat, maka [PB] akan meningkat".',
      'Mesti menghubungkaitkan pemboleh ubah dimanipulasikan dan bergerak balas.',
    ],
  },
  {
    step: 3,
    name: 'Mengawal Pemboleh Ubah',
    shortDesc: 'Menetapkan pemboleh ubah dimanipulasikan, bergerak balas, dan dimalarkan.',
    kssmKeyPoints: [
      'Pemboleh ubah Dimanipulasikan (PM): Parameter yang sengaja diubah oleh penyiasat.',
      'Pemboleh ubah Bergerak Balas (PB): Parameter yang diperhatikan atau diukur hasilnya.',
      'Pemboleh ubah Dimalarkan (PD): Parameter yang dikekalkan tetap agar eksperimen adil.',
    ],
  },
  {
    step: 4,
    name: 'Merancang Eksperimen & Radas',
    shortDesc: 'Menyenaraikan radas, bahan, dan kaedah kerja yang tepat dan jitu.',
    kssmKeyPoints: [
      'Pilih radas yang bersesuaian (cth. buret dan pipet lebih jitu daripada bikar untuk isipadu cecair).',
      'Kenal pasti bahan kimia dan spesifikasi yang diperlukan.',
      'Sediakan langkah kerja eksperimen yang tersusun dan selamat.',
    ],
  },
  {
    step: 5,
    name: 'Menjalankan Eksperimen & Keselamatan',
    shortDesc: 'Melaksanakan prosedur dengan mengutamakan peraturan keselamatan dan simbol bahaya makmal.',
    kssmKeyPoints: [
      'Sentiasa pakai cermin mata keselamatan (gogal) dan kot makmal.',
      'Fahami 6 simbol amaran bahaya KSSM: Mudah Meletup, Mudah Terbakar, Mengakis, Beracun/Toksik, Merengsa, dan Radioaktif.',
      'Jangan rasa atau hidu bahan kimia secara langsung.',
    ],
  },
  {
    step: 6,
    name: 'Mengumpul Data & Pengukuran',
    shortDesc: 'Merekod data secara kuantitatif dengan unit SI dan mengelakkan ralat paralaks.',
    kssmKeyPoints: [
      'Mata mesti berserenjang dengan aras meniskus cecair untuk mengelakkan ralat paralaks.',
      'Bagi air (meniskus melengkung ke bawah), baca di bahagian bawah meniskus.',
      'Bagi merkuri (meniskus melengkung ke atas), baca di bahagian atas meniskus.',
      'Gunakan unit SI standard (m, kg, s, K, A, cm³).',
    ],
  },
  {
    step: 7,
    name: 'Menganalisis & Mentafsir Data',
    shortDesc: 'Membina jadual, memplot graf, dan mencari corak hubungan data.',
    kssmKeyPoints: [
      'Paksi-X mewakili Pemboleh Ubah Dimanipulasikan (PM).',
      'Paksi-Y mewakili Pemboleh Ubah Bergerak Balas (PB).',
      'Hubungan: Berkadar terus (garis lurus melalui asalan) atau bertambah secara linear.',
    ],
  },
  {
    step: 8,
    name: 'Membuat Kesimpulan',
    shortDesc: 'Menentukan sama ada hipotesis diterima atau ditolak berdasarkan dapatan data.',
    kssmKeyPoints: [
      'Jika data menyokong hipotesis, nyatakan "Hipotesis diterima".',
      'Jika data tidak menyokong, hipotesis ditolak dan hipotesis baharu perlu dibina.',
      'Rumuskan hukum sains yang ditemui sebagai penutup penyiasatan.',
    ],
  },
];

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'station-1-masalah',
    stepNumber: 1,
    name: 'Terminal 1: Pengesanan Masalah',
    zone: 'Sektor 1: Bilik Persoalan',
    x: 180,
    y: 190,
    width: 64,
    height: 52,
    isUnlocked: true,
    isCompleted: false,
    themeColor: '#38bdf8', // sky-400
  },
  {
    id: 'station-2-hipotesis',
    stepNumber: 2,
    name: 'Terminal 2: Perumus Hipotesis',
    zone: 'Sektor 1: Bilik Persoalan',
    x: 420,
    y: 190,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#818cf8', // indigo-400
  },
  {
    id: 'station-3-pembolehubah',
    stepNumber: 3,
    name: 'Terminal 3: Matriks Pemboleh Ubah',
    zone: 'Sektor 2: Bilik Kawalan Parameter',
    x: 740,
    y: 190,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#a78bfa', // purple-400
  },
  {
    id: 'station-4-radas',
    stepNumber: 4,
    name: 'Terminal 4: Radas Makmal Jitu',
    zone: 'Sektor 3: Makmal Radas & Kimia',
    x: 180,
    y: 530,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#f59e0b', // amber-500
  },
  {
    id: 'station-5-keselamatan',
    stepNumber: 5,
    name: 'Terminal 5: Protokol Simbol Bahaya',
    zone: 'Sektor 3: Makmal Radas & Kimia',
    x: 420,
    y: 530,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#ef4444', // red-500
  },
  {
    id: 'station-6-pengukuran',
    stepNumber: 6,
    name: 'Terminal 6: Penentukuran Meniskus',
    zone: 'Sektor 4: Zon Pengukuran Kuantitatif',
    x: 740,
    y: 530,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#10b981', // emerald-500
  },
  {
    id: 'station-7-graf',
    stepNumber: 7,
    name: 'Terminal 7: Analisis Corak Graf',
    zone: 'Sektor 5: Hab Teras Utama',
    x: 960,
    y: 260,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#06b6d4', // cyan-500
  },
  {
    id: 'station-8-kesimpulan',
    stepNumber: 8,
    name: 'Terminal 8: Kunci Kesimpulan Teras',
    zone: 'Sektor 5: Hab Teras Utama',
    x: 960,
    y: 460,
    width: 64,
    height: 52,
    isUnlocked: false,
    isCompleted: false,
    themeColor: '#eab308', // yellow-500
  },
];

export const CLUE_TERMINALS: ClueTerminal[] = [
  {
    id: 'clue-1',
    title: 'Nota Dr. Malik: Misteri Ayunan Bandul',
    author: 'Dr. Malik (Ketua Penyelidik)',
    x: 300,
    y: 140,
    content: 'Eksperimen kami terhenti apabila sistem penggera mengunci pintu bilik. Kami sedang menyiasat pergerakan bandul jam kuantum. Ingat: Persoalan yang saintifik mesti boleh diukur dan diuji dengan nombor serta unit!',
    tip: 'Petua: Masalah saintifik dimulakan dengan persoalan mengapakah atau bagaimanakah sesuatu pemboleh ubah mempengaruhi pemboleh ubah yang lain.',
    isRead: false,
  },
  {
    id: 'clue-2',
    title: 'Memo Keselamatan Makmal Bab 1',
    author: 'Pegawai Keselamatan Makmal',
    x: 580,
    y: 140,
    content: 'PERINGATAN: Di dalam makmal sains KSSM Tingkatan 1, bahan dengan simbol tengkorak bersilang ialah bahan TOKSIK (beracun), manakala simbol nyalaan api ialah MUDAH TERBAKAR. Jangan simpan alkohol berhampiran penunu Bunsen!',
    tip: 'Petua: Pastikan anda memakai gogal semasa memanaskan larutan dan halakan mulut tabung uji jauh dari rakan.',
    isRead: false,
  },
  {
    id: 'clue-3',
    title: 'Catatan Rahsia: Aras Meniskus',
    author: 'Profesor Salina',
    x: 580,
    y: 480,
    content: 'Pelajar selalu membuat ralat paralaks semasa membaca silinder penyukat! Untuk air biasa, permukaan cecair melengkung ke bawah. Kedudukan mata mestilah selari tepat dengan titik terendah dasar meniskus cecair.',
    tip: 'Petua: Unit SI bagi isipadu ialah meter padu (m³), namun dalam makmal sekolah unit mililiter (ml) atau cm³ paling kerap disukat.',
    isRead: false,
  },
  {
    id: 'clue-4',
    title: 'Transkrip Graf Kuantum Teras',
    author: 'Sistem AI Makmal Alpha',
    x: 960,
    y: 140,
    content: 'Teras makmal hanya akan aktif semula apabila kesimpulan dibuat secara objektif berdasarkan graf. Graf garis lurus condong ke atas menunjukkan bahawa pemboleh ubah bergerak balas bertambah secara berkadar dengan pemboleh ubah dimanipulasi.',
    tip: 'Petua: Hipotesis yang diterima mesti disokong sepenuhnya oleh corak data graf.',
    isRead: false,
  },
];

export const PUZZLES_DATA: Record<StationId, QuizPuzzle> = {
  'station-1-masalah': {
    stationId: 'station-1-masalah',
    stepNumber: 1,
    title: 'Langkah 1: Mengenal Pasti Masalah',
    subTitle: 'Menentukan Pernyataan Masalah Saintifik Yang Tepat',
    scenario: 'Anda menjumpai radas bandul di Makmal Alpha. Jam makmal terhenti kerana tempoh ayunan bandul berubah-ubah mengikut panjang tali yang berbeza. Sebagai penyiasat saintifik Tingkatan 1, manakah antara persoalan berikut merupakan "Pernyataan Masalah" yang saintifik dan boleh diuji melalui eksperimen?',
    puzzleType: 'single_choice',
    explanationOnCorrect: 'Tepat sekali! Pernyataan masalah saintifik mestilah menghubungkaitkan perkara yang boleh diukur dan diubah (panjang tali) dengan perkara yang diperhatikan (tempoh ayunan lengkap), serta boleh dibuktikan melalui penyiasatan saintifik.',
    options: [
      {
        id: 'opt-1',
        text: 'Mengapakah warna tali bandul kelihatan pudar di bawah lampu makmal?',
        isCorrect: false,
        feedback: 'Warna tali bukan pemboleh ubah yang mempengaruhi fizik ayunan mekanikal dalam eksperimen ini.',
      },
      {
        id: 'opt-2',
        text: 'Adakah panjang tali bandul mempengaruhi tempoh satu ayunan lengkap bandul?',
        isCorrect: true,
        feedback: 'Hebat! Ini ialah pernyataan masalah yang jelas, saintifik, dan boleh diuji secara eksperimen kuantitatif.',
      },
      {
        id: 'opt-3',
        text: 'Berapakah harga jam randik digital yang digunakan oleh penyelidik makmal?',
        isCorrect: false,
        feedback: 'Harga alat bukan masalah saintifik yang disiasat melalui kaedah saintifik.',
      },
      {
        id: 'opt-4',
        text: 'Adakah bandul itu kelihatan cantik semasa berayun ke kiri dan kanan?',
        isCorrect: false,
        feedback: '"Kelihatan cantik" bersifat subjektif dan tidak boleh diukur secara saintifik.',
      },
    ],
  },

  'station-2-hipotesis': {
    stationId: 'station-2-hipotesis',
    stepNumber: 2,
    title: 'Langkah 2: Membina Hipotesis',
    subTitle: 'Menghubungkan Pemboleh Ubah Menjadi Suatu Hipotesis Yang Boleh Diuji',
    scenario: 'Selepas mengenal pasti masalah mengenai panjang tali bandul dan tempoh ayunan, anda perlu merumuskan satu hipotesis saintifik sebelum eksperimen bermula. Bina hipotesis yang paling saintifik dan tepat menurut format KSSM.',
    puzzleType: 'hypothesis_builder',
    explanationOnCorrect: 'Syabas! Hipotesis yang mantap membuat ramalan awal logik yang menghubungkan pemboleh ubah dimanipulasikan (panjang tali) dengan pemboleh ubah bergerak balas (tempoh ayunan).',
    hypothesisData: {
      part1Options: [
        'Semakin panjang tali bandul,',
        'Semakin berat ladung bandul,',
        'Semakin berkilat permukaan ladung,',
      ],
      part2Options: [
        'semakin bertambah tempoh bagi satu ayunan lengkap.',
        'semakin berubah warna tali bandul.',
        'semakin berkurang jisim bahan di dalam makmal.',
      ],
      correctPart1: 'Semakin panjang tali bandul,',
      correctPart2: 'semakin bertambah tempoh bagi satu ayunan lengkap.',
    },
  },

  'station-3-pembolehubah': {
    stationId: 'station-3-pembolehubah',
    stepNumber: 3,
    title: 'Langkah 3: Mengawal Pemboleh Ubah',
    subTitle: 'Pengelasan Pemboleh Ubah Dimanipulasikan, Bergerak Balas & Dimalarkan',
    scenario: 'Untuk memastikan penyiasatan adil (fair test), setiap parameter eksperimen ayunan bandul mesti dikawal rapi. Seret atau pilih kategori yang tepat bagi ketiga-tiga pemboleh ubah berikut:',
    puzzleType: 'variable_sorter',
    explanationOnCorrect: 'Cemerlang! Dalam eksperimen ini: Panjang tali diubah secara sengaja (PM), Masa/tempoh ayunan dicatat hasilnya (PB), dan Jisim ladung serta sudut ayunan dikekalkan sama (PD) agar penyiasatan adalah adil!',
    variables: [
      {
        id: 'var-1',
        label: 'Panjang tali bandul (20cm, 30cm, 40cm, 50cm)',
        category: 'manipulasi',
      },
      {
        id: 'var-2',
        label: 'Masa yang diambil untuk 10 ayunan lengkap',
        category: 'bergerakbalas',
      },
      {
        id: 'var-3',
        label: 'Jisim ladung bandul & sudut sesaran mula ayunan',
        category: 'dimalarkan',
      },
    ],
  },

  'station-4-radas': {
    stationId: 'station-4-radas',
    stepNumber: 4,
    title: 'Langkah 4: Merancang Eksperimen & Memilih Radas',
    subTitle: 'Pemilihan Alat Pengukuran KSSM Yang Tepat',
    scenario: 'Untuk mengukur isipadu cecair reagen sebanyak 25.40 cm³ dengan kejituan paling tinggi bagi mengaktifkan tiub penyejuk makmal, radas makmal manakah yang paling jitu dan sesuai digunakan?',
    puzzleType: 'single_choice',
    explanationOnCorrect: 'Tepat sekali! Buret mempunyai kejituan sehingga 0.05 cm³ atau 0.1 cm³, menjadikannya sangat sesuai untuk menyukat isipadu cecair yang memerlukan kejituan tinggi berbanding bikar atau kelalang kon.',
    options: [
      {
        id: 'r-1',
        text: 'Bikar 100 ml (Kejituan anggaran sahaja)',
        isCorrect: false,
        feedback: 'Bikar hanya memberikan anggaran kasar isipadu cecair, bukan ukuran jitu.',
      },
      {
        id: 'r-2',
        text: 'Buret 50 ml (Kejituan tinggi dengan skala 0.1 cm³)',
        isCorrect: true,
        feedback: 'Bagus! Buret direka untuk menyukat isipadu cecair dengan kejituan tinggi.',
      },
      {
        id: 'r-3',
        text: 'Tabung uji kaca (Tiada skala ukuran)',
        isCorrect: false,
        feedback: 'Tabung uji digunakan untuk mengisi atau memanaskan bahan uji kuantiti kecil, bukan menyukat isipadu.',
      },
      {
        id: 'r-4',
        text: 'Kelalang kon 250 ml (Skala anggaran kasar)',
        isCorrect: false,
        feedback: 'Kelalang kon tidak mempunyai ketepatan yang mencukupi untuk bacaan titik perpuluhan 25.40 cm³.',
      },
    ],
  },

  'station-5-keselamatan': {
    stationId: 'station-5-keselamatan',
    stepNumber: 5,
    title: 'Langkah 5: Menjalankan Eksperimen & Simbol Bahaya',
    subTitle: 'Mengenal Pasti Simbol Amaran Keselamatan Makmal KSSM',
    scenario: 'Di atas meja uji kaji terdapat botol kimia berlabel cecair asid sulfurik pekat dengan simbol amaran cecair menitis ke atas tangan dan permukaan sehingga terhakis. Apakah maksud simbol keselamatan ini dan tindakan selamat yang mesti diambil?',
    puzzleType: 'single_choice',
    explanationOnCorrect: 'Tepat sekali! Simbol tangan dan permukaan berlubang akibat titisan bahan ialah simbol MENGAKIS (Corrosive). Asid dan alkali pekat boleh membakar kulit, maka sarung tangan getah dan basuhan air segera diperlukan jika terkena.',
    options: [
      {
        id: 's-1',
        text: 'Simbol: MENGAKIS. Tindakan: Pakai sarung tangan pelindung & bilas dengan air mengalir jika terkena kulit.',
        isCorrect: true,
        feedback: 'Hebat! Anda menguasai peraturan keselamatan makmal sains.',
      },
      {
        id: 's-2',
        text: 'Simbol: MUDAH TERBAKAR. Tindakan: Simpan berdekatan penunu Bunsen yang sedang menyala.',
        isCorrect: false,
        feedback: 'Salah! Simbol mudah terbakar dilambangkan dengan nyalaan api, dan tidak boleh didekatkan dengan api.',
      },
      {
        id: 's-3',
        text: 'Simbol: RADIOAKTIF. Tindakan: Biarkan botol terbuka di ruang udara makmal.',
        isCorrect: false,
        feedback: 'Simbol radioaktif ialah simbol bilah trifoil kipas tiga, dan bahan radioaktif perlu disimpan di dalam bekas plumbum tebal.',
      },
      {
        id: 's-4',
        text: 'Simbol: MUDAH MELETUP. Tindakan: Goncang botol dengan kuat sebelum dibuka.',
        isCorrect: false,
        feedback: 'Menggoncang bahan mudah meletup sangat berbahaya dan boleh mencetuskan letupan.',
      },
    ],
  },

  'station-6-pengukuran': {
    stationId: 'station-6-pengukuran',
    stepNumber: 6,
    title: 'Langkah 6: Mengumpul Data & Membaca Meniskus',
    subTitle: 'Penentukuran Aras Meniskus & Mengelakkan Ralat Paralaks',
    scenario: 'Cecair reagen biru diisi ke dalam silinder penyukat. Permukaan air melengkung ke bawah (meniskus cekung). Untuk mengelakkan ralat paralaks, aras mata anda mesti berserenjang dengan dasar meniskus. Laraskan atau pilih bacaan isipadu yang betul berdasarkan gambarajah penunjuk silinder.',
    puzzleType: 'meniscus_reading',
    explanationOnCorrect: 'Tahniah! Bagi cecair seperti air yang membasahi kaca, meniskus melengkung ke bawah. Bacaan yang sah dan tepat diambil pada dasar paling bawah meniskus (iaitu tepat 42.0 ml / cm³).',
    meniscusData: {
      correctVolume: 42,
      tolerance: 0.5,
      unit: 'ml (cm³)',
      description: 'Silinder penyukat menunjukkan aras cecair di antara 40 ml dan 50 ml. Garis dasar lengkungan meniskus air berada tepat pada garisan kedua di atas 40 ml (setiap senggatan kecil mewakili 1 ml).',
    },
  },

  'station-7-graf': {
    stationId: 'station-7-graf',
    stepNumber: 7,
    title: 'Langkah 7: Menganalisis & Mentafsir Data',
    subTitle: 'Mentafsir Corak Hubungan Pada Graf Garis Eksperimen',
    scenario: 'Data eksperimen ayunan bandul telah diplot ke dalam bentuk graf garis di mana Paksi-X ialah Panjang Tali (cm) dan Paksi-Y ialah Masa untuk 10 Ayunan (saat). Garis graf bermula dari bawah dan menaik lurus secara seragam ke kanan atas. Apakah tafsiran hubungan data yang paling tepat?',
    puzzleType: 'single_choice',
    explanationOnCorrect: 'Tepat sekali! Graf garis lurus yang condong menaik ke kanan menunjukkan hubungan: semakin bertambah panjang tali bandul, semakin bertambah masa yang diambil bagi ayunan lengkap.',
    options: [
      {
        id: 'g-1',
        text: 'Semakin bertambah panjang tali bandul, semakin bertambah masa yang diambil untuk ayunan.',
        isCorrect: true,
        feedback: 'Cemerlang! Ini tafsiran corak graf yang tepat menurut KSSM Tingkatan 1.',
      },
      {
        id: 'g-2',
        text: 'Panjang tali bandul tidak mempunyai sebarang kesan terhadap masa ayunan bandul.',
        isCorrect: false,
        feedback: 'Jika tiada kesan, graf akan menjadi garis mendatar rata (kecerunan sifar).',
      },
      {
        id: 'g-3',
        text: 'Masa ayunan menjadi sifar apabila panjang tali bertambah panjang.',
        isCorrect: false,
        feedback: 'Data graf jelas menunjukkan masa meningkat, bukan berkurang ke sifar.',
      },
      {
        id: 'g-4',
        text: 'Graf menunjukkan eksperimen ini gagal kerana garisannya lurus.',
        isCorrect: false,
        feedback: 'Garisan lurus menunjukkan hubungan linear yang konsisten dan sangat berjaya.',
      },
    ],
  },

  'station-8-kesimpulan': {
    stationId: 'station-8-kesimpulan',
    stepNumber: 8,
    title: 'Langkah 8: Membuat Kesimpulan & Nyahkunci Teras',
    subTitle: 'Pengesahan Hipotesis & Rumusan Akhir Penyiasatan Saintifik',
    scenario: 'Berdasarkan data dan analisis graf yang diperolehi, data menyokong sepenuhnya hipotesis awal yang dibina di Stesen 2. Apakah kesimpulan rasmi yang perlu disahkan pada konsol Teras Makmal Alpha untuk menamatkan penutupan kecemasan makmal?',
    puzzleType: 'single_choice',
    explanationOnCorrect: 'Luar biasa! Apabila dapatan data menyokong ramalan awal, "Hipotesis diterima". Kesimpulan merumuskan dapatan bahawa panjang tali bandul secara langsung menentukan tempoh ayunan lengkap!',
    options: [
      {
        id: 'k-1',
        text: 'Hipotesis diterima: Semakin panjang tali bandul, semakin bertambah tempoh bagi satu ayunan lengkap.',
        isCorrect: true,
        feedback: 'Bagus sekali! Kesimpulan ini mengesahkan hipotesis saintifik dan menepati kaedah penyiasatan saintifik KSSM!',
      },
      {
        id: 'k-2',
        text: 'Hipotesis ditolak: Kita mesti menukar topik sains dan melupakan eksperimen bandul.',
        isCorrect: false,
        feedback: 'Data menyokong hipotesis, maka hipotesis tidak boleh ditolak sewenang-wenangnya.',
      },
      {
        id: 'k-3',
        text: 'Tiada kesimpulan boleh dibuat kerana eksperimen sains tidak memerlukan rumusan akhir.',
        isCorrect: false,
        feedback: 'Langkah terakhir kaedah saintifik ialah membuat kesimpulan dan menulis laporan.',
      },
      {
        id: 'k-4',
        text: 'Hipotesis diterima: Bandul hanya boleh berayun jika digerakkan oleh kuasa sihir.',
        isCorrect: false,
        feedback: 'Sains berasaskan bukti empirikal dan hukum fizik alam, bukan kuasa ghaib.',
      },
    ],
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'Langkah Pertama',
    description: 'Selesaikan teka-teki Mengenal Pasti Masalah',
    unlocked: false,
    icon: '🎯',
  },
  {
    id: 'variable-master',
    name: 'Pakar Pemboleh Ubah',
    description: 'Kelaskan PM, PB, dan PD dengan tepat pada cubaan pertama',
    unlocked: false,
    icon: '⚖️',
  },
  {
    id: 'lab-safety',
    name: 'Wira Keselamatan',
    description: 'Kuasai simbol amaran keselamatan makmal sains',
    unlocked: false,
    icon: '🛡️',
  },
  {
    id: 'meniscus-eye',
    name: 'Mata Helang Meniskus',
    description: 'Membaca aras meniskus cecair tanpa ralat paralaks',
    unlocked: false,
    icon: '👁️',
  },
  {
    id: 'master-scientist',
    name: 'Saintis Kanan Makmal Alpha',
    description: 'Lengkapkan kesemua 8 langkah kaedah saintifik dan nyahkunci teras',
    unlocked: false,
    icon: '🏆',
  },
];
