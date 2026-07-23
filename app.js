let users = JSON.parse(localStorage.getItem("users")) || {};

// Anti-flash: if a language is already saved, hide the language screen immediately.
if (localStorage.getItem("pixelgames_language")) {
  document.getElementById("languageScreen").style.display = "none";
}

/* ============================================================
   LANGUAGE SYSTEM
   ============================================================ */
const LANG_KEY = "pixelgames_language";

const I18N = {
  en: {
    lang_select_title: "Choose your language",
    lang_select_sub:
      "Select a language to continue. You can always change it later in Profile.",
    auth_sub: "Your personal game collection, sealed and ready.",
    tab_login: "Sign In",
    tab_register: "Register",
    label_gmail: "Gmail",
    label_password: "Password",
    label_nickname: "Nickname",
    ph_nickname: "How should we call you?",
    ph_password_min: "At least 6 characters",
    btn_enter_vault: "Enter Vault",
    btn_create_account: "Create Account",
    auth_foot_new: "New here?",
    auth_foot_create_link: "Create an account",
    nav_store: "Store",
    nav_library: "Library",
    nav_wallet: "Wallet",
    nav_profile: "Profile",
    nav_friends: "Friends",
    nav_partnership: "Partnership",
    nav_ads: "Advertisements",
    nav_exchange: "Currency Exchange",
    btn_logout: "Log Out",

    // ADDED — expanded translation coverage
    store_title: "Store",
    store_desc:
      "Browse the catalog. Add titles to your library to unlock play.",

    // ADDED — store promo carousel
    promo_slide_1: "New games are now available for everyone",
    promo_slide_2: "This space could be your advertisement",
    promo_slide_3: "Don't miss the chance to buy the latest games",
    promo_slide_4: "Your next adventure starts here",
    promo_slide_5: "Play. Discover. Enjoy.",

    library_title: "Library",
    library_desc: "Games you own. Hit Play to launch.",
    library_empty_title: "Library Empty",
    library_empty_desc:
      "Nothing here yet. Head to the Store and add a game to start your collection.",
    library_purchased_on: "Purchased on",
    library_playtime: "Playtime",
    btn_play: "Play",
    btn_remove_game: "Remove Game",
    btn_details: "Details",
    btn_buy: "Buy",
    btn_add: "Add",
    wallet_choose_amount: "Choose an amount",
    wallet_custom_amount: "Custom amount",
    wallet_payment_card: "Payment card",
    wallet_card_holder: "Card Holder Name",
    wallet_card_number: "Card Number",
    wallet_expiry: "Expiration Date",
    wallet_cvv: "CVV",
    wallet_save_card: "Save card for next time",
    wallet_topup_btn: "Top Up",
    wallet_recent_topups: "Recent top-ups",
    wallet_no_topups_title: "No Top-Ups Yet",
    wallet_no_topups_desc:
      "Your top-up history will show up here once you add funds.",

    // ADDED — Currency Exchange
    exchange_title: "Currency Exchange",
    exchange_desc:
      "Exchange your coins for real USD. Requests are reviewed by an admin before payout.",
    exchange_balance_label: "Your Coin Balance",
    exchange_available_label: "Available to exchange: {amount}",
    exchange_rate_label: "1000 coins = $1",
    exchange_form_title: "Exchange coins",
    exchange_amount_label: "Amount of coins",
    exchange_amount_placeholder: "1000",
    exchange_you_receive: "You will receive",
    exchange_min_notice: "You need at least 1000 coins to exchange.",
    exchange_insufficient_notice: "You don't have enough coins for this amount.",
    exchange_payout_title: "Payout details",
    exchange_payment_method_label: "Payment method",
    exchange_payout_details_label: "Account / wallet details",
    exchange_payout_details_placeholder:
      "Card number, PayPal email, wallet address…",
    exchange_payout_required: "Please enter your payout details.",
    exchange_submit_btn: "Request Exchange",
    exchange_submitted: "Exchange request submitted for review!",
    exchange_failed: "Could not submit exchange request. Please try again.",
    exchange_not_synced:
      "We couldn't verify your balance yet — please try again in a moment.",
    exchange_history_title: "Exchange history",
    exchange_no_history: "No exchange requests yet.",
    exchange_history_error: "Could not load exchange history.",
    exchange_status_pending: "Pending",
    exchange_status_approved: "Approved",
    exchange_status_rejected: "Rejected",
    exchange_status_completed: "Completed",

    daily_bonus_title: "Daily Bonus",
    daily_bonus_desc: "Claim a free reward every 24 hours.",
    daily_bonus_reward: "+50 Coins",
    daily_bonus_claim_btn: "Claim Reward",
    daily_bonus_claimed_btn: "Claimed",
    daily_bonus_next_in: "Next reward in",
    profile_title: "Profile",
    profile_desc: "Your stats, achievements, and account settings.",
    stat_games_owned: "Games Owned",
    stat_hours_played: "Hours Played",
    stat_achievements: "Achievements",
    stat_wishlist: "Wishlist",
    stat_coins: "Coins",
    favorite_game_label: "Favorite Game",
    favorites_count_label: "Favorites Count",
    member_since_label: "Member Since",
    achievements_heading: "Achievements",
    settings_heading: "Settings",
    settings_nickname: "Nickname",
    settings_avatar: "Avatar",
    settings_theme: "Accent Color",
    settings_language: "Language",
    theme_auto: "Auto",
    theme_gold: "Gold",
    theme_blue: "Blue",
    theme_purple: "Purple",
    theme_emerald: "Emerald",
    theme_auto_hint:
      '"Auto" follows your Light/Dark mode: Purple in Dark, Emerald in Light.',
    danger_zone: "Danger zone",
    btn_delete_account: "Delete Account",
    btn_change_avatar: "Change Avatar",
    premium_heading: "Pixel&Games Premium",
    premium_status_free: "Free Account",
    premium_status_active: "Premium Member",
    premium_since_label: "Premium since",
    premium_activate_btn: "Activate Premium",
    premium_benefits_badge: "Premium badge on profile",
    premium_benefits_border: "Exclusive profile border",
    premium_benefits_icon: "Golden Premium icon",
    premium_benefits_cosmetic: "Premium-only cosmetic effects",
    premium_price_label: "One-time activation from your Wallet balance",
    playtime_heading: "Play Time",
    playtime_total_hours: "Total Hours Played",
    playtime_per_game: "Per Game Playtime",
    recent_activity_heading: "Recent Activity",
    recent_activity_empty:
      "No sessions yet — play a game from your Library to see activity here.",
    purchase_history_heading: "Purchase History",
    purchase_history_empty: "No purchases yet.",
    daily_reward_status_heading: "Daily Reward Status",
    daily_reward_ready: "Ready to claim",
    daily_reward_waiting: "Already claimed — come back later",
    total_friends_label: "Total Friends",
    online_friends_label: "Online Friends",
    pending_requests_label: "Pending Requests",
    friend_requests_heading: "Friend requests",
    my_friends_heading: "My Friends",
    find_players_heading: "Find players",
    search_players_ph: "Search players by nickname…",
    no_requests_title: "No Pending Requests",
    no_requests_desc:
      "You're all caught up. New friend requests will show up here.",

    // ADDED — fullscreen, avatar, bio, country, activity graph
    nav_fullscreen: "Fullscreen",
    fullscreen_entered: "Entered Fullscreen",
    fullscreen_exited: "Exited Fullscreen",
    btn_upload_avatar: "Upload Photo",
    btn_remove_avatar: "Remove Avatar",
    avatar_invalid_file: "Please choose an image file.",
    avatar_uploaded: "Avatar updated.",
    avatar_removed: "Avatar removed.",
    settings_bio: "Bio",
    ph_bio: "Tell other players about yourself…",
    bio_empty_hint: "No bio yet. Tell other players about yourself.",
    settings_country: "Country",
    country_not_set: "Not set",
    country_label: "Country",
    member_since_prefix: "Member since",
    activity_graph_heading: "Activity Graph",
    activity_legend_logins: "Logins",
    activity_legend_games: "Games Played",
    activity_legend_purchases: "Purchases",
    activity_legend_library: "Library Adds",
    activity_range_7: "7 Days",
    activity_range_30: "30 Days",
    activity_empty:
      "No activity recorded yet. Play, log in, or shop to see your graph grow.",
    notif_heading: "Notifications",
    notif_empty: "No notifications yet. Play a game to see updates here.",
    notif_played_prefix: "Played",

    // ADDED — search system
    search_placeholder: "Search games...",
    search_no_results_store: "No games found.",
    search_no_results_library: "No games found in your library.",

    // ADDED — Recently Played
    recently_played_title: "Recently Played",
    recently_played_desc: "Jump back into your recent games.",
    recently_played_empty_title: "No games played yet",
    recently_played_empty_desc:
      "Launch a game from your Library and it'll show up here.",
    btn_play_again: "Play Again",

    // ADDED — Mystery Box
    mystery_box_title: "Mystery Box",
    mystery_box_desc: "Open one free box every day for a random reward.",
    mystery_box_open_btn: "Open Box",
    mystery_box_come_back: "Come back tomorrow for another Mystery Box",
    mystery_box_congrats: "Congratulations!",
    mystery_box_you_received: "You received",

    // ADDED — Game of the Day
    game_of_the_day_title: "Game of the Day",

    // ADDED — Category filters
    category_all: "All",

    // ADDED — Player Statistics
    player_stats_heading: "Player Statistics",
    pstat_games_played: "Games Played",
    pstat_total_playtime: "Total Playtime",
    pstat_coins_earned: "Coins Earned",
    pstat_mystery_boxes: "Mystery Boxes Opened",
    pstat_recently_played: "Recently Played Games",

    // ADDED — Profile Badges
    badges_heading: "Profile Badges",
    badge_state_locked: "Locked",
    badge_state_unlocked: "Unlocked",
    badge_unlocked_toast: "Badge unlocked",
    badge_select_favorite_hint: "Click to display on your profile",
    badge_first_player_name: "First Player",
    badge_first_player_desc: "Launch your first game.",
    badge_game_explorer_name: "Game Explorer",
    badge_game_explorer_desc: "Play 5 different games.",
    badge_mystery_hunter_name: "Mystery Hunter",
    badge_mystery_hunter_desc: "Open a Mystery Box.",
    badge_coin_collector_name: "Coin Collector",
    badge_coin_collector_desc: "Earn 1,000 Coins in total.",
    badge_premium_player_name: "Premium Player",
    badge_premium_player_desc: "Become a Premium member.",
    badge_game_collector_name: "Game Collector",
    badge_game_collector_desc: "Play or own 8 different games.",
  },
  ru: {
    lang_select_title: "Выберите язык",
    lang_select_sub:
      "Выберите язык, чтобы продолжить. Вы всегда можете изменить его позже в Профиле.",
    auth_sub:
      "Ваша личная коллекция игр, надёжно защищена и готова к использованию.",
    tab_login: "Вход",
    tab_register: "Регистрация",
    label_gmail: "Gmail",
    label_password: "Пароль",
    label_nickname: "Никнейм",
    ph_nickname: "Как вас называть?",
    ph_password_min: "Минимум 6 символов",
    btn_enter_vault: "Войти",
    btn_create_account: "Создать аккаунт",
    auth_foot_new: "Впервые здесь?",
    auth_foot_create_link: "Создать аккаунт",
    nav_store: "Магазин",
    nav_library: "Библиотека",
    nav_wallet: "Кошелёк",
    nav_profile: "Профиль",
    nav_friends: "Друзья",
    nav_partnership: "Партнёрство",
    nav_ads: "Реклама",
    nav_exchange: "Обмен валют",
    btn_logout: "Выйти",

    // ADDED — expanded translation coverage
    store_title: "Магазин",
    store_desc:
      "Просматривайте каталог. Добавляйте игры в библиотеку, чтобы играть.",

    // ADDED — store promo carousel
    promo_slide_1: "Новые игры уже доступны для всех",
    promo_slide_2: "Это место может стать вашей рекламой",
    promo_slide_3: "Не упустите шанс купить новейшие игры",
    promo_slide_4: "Ваше следующее приключение начинается здесь",
    promo_slide_5: "Играй. Открывай. Наслаждайся.",

    library_title: "Библиотека",
    library_desc:
      "Игры, которыми вы владеете. Нажмите Играть, чтобы запустить.",
    library_empty_title: "Библиотека пуста",
    library_empty_desc:
      "Здесь пока ничего нет. Перейдите в Магазин и добавьте игру, чтобы начать коллекцию.",
    library_purchased_on: "Куплено",
    library_playtime: "Наиграно",
    btn_play: "Играть",
    btn_remove_game: "Удалить игру",
    btn_details: "Подробнее",
    btn_buy: "Купить",
    btn_add: "Добавить",
    wallet_choose_amount: "Выберите сумму",
    wallet_custom_amount: "Другая сумма",
    wallet_payment_card: "Платёжная карта",
    wallet_card_holder: "Имя владельца карты",
    wallet_card_number: "Номер карты",
    wallet_expiry: "Срок действия",
    wallet_cvv: "CVV",
    wallet_save_card: "Сохранить карту на будущее",
    wallet_topup_btn: "Пополнить",
    wallet_recent_topups: "Недавние пополнения",
    wallet_no_topups_title: "Пока нет пополнений",
    wallet_no_topups_desc:
      "История пополнений появится здесь после первого пополнения.",

    // ADDED — Обмен валют
    exchange_title: "Обмен валют",
    exchange_desc:
      "Обменивайте монеты на реальные доллары США. Заявки проверяются администратором перед выплатой.",
    exchange_balance_label: "Баланс монет",
    exchange_available_label: "Доступно к обмену: {amount}",
    exchange_rate_label: "1000 монет = $1",
    exchange_form_title: "Обмен монет",
    exchange_amount_label: "Количество монет",
    exchange_amount_placeholder: "1000",
    exchange_you_receive: "Вы получите",
    exchange_min_notice: "Для обмена нужно минимум 1000 монет.",
    exchange_insufficient_notice: "Недостаточно монет для этой суммы.",
    exchange_payout_title: "Детали выплаты",
    exchange_payment_method_label: "Способ оплаты",
    exchange_payout_details_label: "Счёт / реквизиты кошелька",
    exchange_payout_details_placeholder:
      "Номер карты, email PayPal, адрес кошелька…",
    exchange_payout_required: "Укажите реквизиты для выплаты.",
    exchange_submit_btn: "Запросить обмен",
    exchange_submitted: "Заявка на обмен отправлена на проверку!",
    exchange_failed: "Не удалось отправить заявку. Попробуйте снова.",
    exchange_not_synced:
      "Не удалось проверить баланс — попробуйте ещё раз через момент.",
    exchange_history_title: "История обменов",
    exchange_no_history: "Заявок на обмен пока нет.",
    exchange_history_error: "Не удалось загрузить историю обменов.",
    exchange_status_pending: "В ожидании",
    exchange_status_approved: "Одобрено",
    exchange_status_rejected: "Отклонено",
    exchange_status_completed: "Завершено",

    daily_bonus_title: "Ежедневный бонус",
    daily_bonus_desc: "Забирайте бесплатную награду каждые 24 часа.",
    daily_bonus_reward: "+50 монет",
    daily_bonus_claim_btn: "Забрать награду",
    daily_bonus_claimed_btn: "Получено",
    daily_bonus_next_in: "Следующая награда через",
    profile_title: "Профиль",
    profile_desc: "Ваша статистика, достижения и настройки аккаунта.",
    stat_games_owned: "Игр в библиотеке",
    stat_hours_played: "Часов сыграно",
    stat_achievements: "Достижения",
    stat_wishlist: "Список желаний",
    stat_coins: "Монеты",
    favorite_game_label: "Любимая игра",
    favorites_count_label: "Избранного",
    member_since_label: "Дата регистрации",
    achievements_heading: "Достижения",
    settings_heading: "Настройки",
    settings_nickname: "Никнейм",
    settings_avatar: "Аватар",
    settings_theme: "Цвет акцента",
    settings_language: "Язык",
    theme_auto: "Авто",
    theme_gold: "Золотая",
    theme_blue: "Синяя",
    theme_purple: "Фиолетовая",
    theme_emerald: "Изумрудная",
    theme_auto_hint:
      "«Авто» подстраивается под тему: фиолетовый в тёмной, изумрудный в светлой.",
    danger_zone: "Опасная зона",
    btn_delete_account: "Удалить аккаунт",
    btn_change_avatar: "Сменить аватар",
    premium_heading: "Pixel&Games Premium",
    premium_status_free: "Обычный аккаунт",
    premium_status_active: "Premium-статус",
    premium_since_label: "Premium с",
    premium_activate_btn: "Активировать Premium",
    premium_benefits_badge: "Значок Premium в профиле",
    premium_benefits_border: "Эксклюзивная рамка профиля",
    premium_benefits_icon: "Золотая иконка Premium",
    premium_benefits_cosmetic: "Косметические эффекты только для Premium",
    premium_price_label: "Разовая активация со средств вашего Кошелька",
    playtime_heading: "Игровое время",
    playtime_total_hours: "Всего часов сыграно",
    playtime_per_game: "Время по играм",
    recent_activity_heading: "Недавняя активность",
    recent_activity_empty:
      "Пока нет сессий — запустите игру из Библиотеки, чтобы увидеть активность здесь.",
    purchase_history_heading: "История покупок",
    purchase_history_empty: "Пока нет покупок.",
    daily_reward_status_heading: "Статус ежедневной награды",
    daily_reward_ready: "Готово к получению",
    daily_reward_waiting: "Уже получено — загляните позже",
    total_friends_label: "Всего друзей",
    online_friends_label: "Друзей онлайн",
    pending_requests_label: "Ожидающих заявок",
    friend_requests_heading: "Заявки в друзья",
    my_friends_heading: "Мои друзья",
    find_players_heading: "Найти игроков",
    search_players_ph: "Поиск игроков по никнейму…",
    no_requests_title: "Нет ожидающих заявок",
    no_requests_desc: "Здесь появятся новые заявки в друзья.",

    // ADDED — fullscreen, avatar, bio, country, activity graph
    nav_fullscreen: "Во весь экран",
    fullscreen_entered: "Полноэкранный режим включён",
    fullscreen_exited: "Полноэкранный режим выключён",
    btn_upload_avatar: "Загрузить фото",
    btn_remove_avatar: "Удалить аватар",
    avatar_invalid_file: "Пожалуйста, выберите файл изображения.",
    avatar_uploaded: "Аватар обновлён.",
    avatar_removed: "Аватар удалён.",
    settings_bio: "О себе",
    ph_bio: "Расскажите другим игрокам о себе…",
    bio_empty_hint: "Пока нет описания. Расскажите другим игрокам о себе.",
    settings_country: "Страна",
    country_not_set: "Не указано",
    country_label: "Страна",
    member_since_prefix: "В сети с",
    activity_graph_heading: "График активности",
    activity_legend_logins: "Входы",
    activity_legend_games: "Игровые сессии",
    activity_legend_purchases: "Покупки",
    activity_legend_library: "Добавления в библиотеку",
    activity_range_7: "7 дней",
    activity_range_30: "30 дней",
    activity_empty:
      "Активности пока нет. Играйте, входите в аккаунт или совершайте покупки, чтобы график заполнился.",
    notif_heading: "Уведомления",
    notif_empty:
      "Пока нет уведомлений. Сыграйте в игру, чтобы увидеть обновления здесь.",
    notif_played_prefix: "Сыграно:",

    // ADDED — search system
    search_placeholder: "Поиск игр...",
    search_no_results_store: "Игры не найдены.",
    search_no_results_library: "В вашей библиотеке игры не найдены.",

    // ADDED — Recently Played
    recently_played_title: "Недавно сыгранные",
    recently_played_desc: "Вернитесь к своим недавним играм.",
    recently_played_empty_title: "Вы ещё не играли",
    recently_played_empty_desc:
      "Запустите игру из библиотеки, и она появится здесь.",
    btn_play_again: "Играть снова",

    // ADDED — Mystery Box
    mystery_box_title: "Таинственная коробка",
    mystery_box_desc:
      "Открывайте одну бесплатную коробку каждый день и получайте случайную награду.",
    mystery_box_open_btn: "Открыть коробку",
    mystery_box_come_back: "Возвращайтесь завтра за новой коробкой",
    mystery_box_congrats: "Поздравляем!",
    mystery_box_you_received: "Вы получили",

    // ADDED — Game of the Day
    game_of_the_day_title: "Игра дня",

    // ADDED — Category filters
    category_all: "Все",

    // ADDED — Player Statistics
    player_stats_heading: "Статистика игрока",
    pstat_games_played: "Сыграно игр",
    pstat_total_playtime: "Общее время игры",
    pstat_coins_earned: "Заработано монет",
    pstat_mystery_boxes: "Открыто коробок",
    pstat_recently_played: "Недавно сыгранные игры",

    // ADDED — Profile Badges
    badges_heading: "Значки профиля",
    badge_state_locked: "Заблокировано",
    badge_state_unlocked: "Разблокировано",
    badge_unlocked_toast: "Значок разблокирован",
    badge_select_favorite_hint: "Нажмите, чтобы показать в профиле",
    badge_first_player_name: "Первый игрок",
    badge_first_player_desc: "Запустите свою первую игру.",
    badge_game_explorer_name: "Исследователь игр",
    badge_game_explorer_desc: "Сыграйте в 5 разных игр.",
    badge_mystery_hunter_name: "Охотник за тайнами",
    badge_mystery_hunter_desc: "Откройте таинственную коробку.",
    badge_coin_collector_name: "Коллекционер монет",
    badge_coin_collector_desc: "Заработайте 1000 монет в сумме.",
    badge_premium_player_name: "Премиум игрок",
    badge_premium_player_desc: "Станьте Premium-пользователем.",
    badge_game_collector_name: "Коллекционер игр",
    badge_game_collector_desc: "Сыграйте или владейте 8 разными играми.",
  },
  uz: {
    lang_select_title: "Tilni tanlang",
    lang_select_sub:
      "Davom etish uchun tilni tanlang. Buni keyinchalik Profilda o'zgartirishingiz mumkin.",
    auth_sub: "Sizning shaxsiy o‘yinlar to‘plamingiz, xavfsiz va tayyor.",
    tab_login: "Kirish",
    tab_register: "Ro'yxatdan o'tish",
    label_gmail: "Gmail",
    label_password: "Parol",
    label_nickname: "Taxallus",
    ph_nickname: "Sizni qanday chaqirishimiz kerak?",
    ph_password_min: "Kamida 6 ta belgi",
    btn_enter_vault: "Kirish",
    btn_create_account: "Hisob yaratish",
    auth_foot_new: "Bu yerda birinchi martami?",
    auth_foot_create_link: "Hisob yaratish",
    nav_store: "Do'kon",
    nav_library: "Kutubxona",
    nav_wallet: "Hamyon",
    nav_profile: "Profil",
    nav_friends: "Do'stlar",
    nav_partnership: "Hamkorlik",
    nav_ads: "Reklama",
    nav_exchange: "Valyuta almashish",
    btn_logout: "Chiqish",

    // ADDED — expanded translation coverage
    store_title: "Do'kon",
    store_desc:
      "Katalogni ko'ring. O'ynash uchun o'yinlarni kutubxonangizga qo'shing.",

    // ADDED — store promo carousel
    promo_slide_1: "Yangi o'yinlar endi barchaga mavjud",
    promo_slide_2: "Bu joy sizning reklamangiz bo'lishi mumkin",
    promo_slide_3: "Eng so'nggi o'yinlarni sotib olish imkoniyatini boy bermang",
    promo_slide_4: "Keyingi sarguzashtingiz aynan shu yerdan boshlanadi",
    promo_slide_5: "O'yna. Kashf et. Zavqlan.",

    library_title: "Kutubxona",
    library_desc:
      "Sizga tegishli o'yinlar. Ishga tushirish uchun O'ynash tugmasini bosing.",
    library_empty_title: "Kutubxona bo'sh",
    library_empty_desc:
      "Hali hech narsa yo'q. To'plamingizni boshlash uchun Do'konga o'ting va o'yin qo'shing.",
    library_purchased_on: "Xarid qilingan",
    library_playtime: "O'ynalgan vaqt",
    btn_play: "O'ynash",
    btn_remove_game: "O'yinni o'chirish",
    btn_details: "Batafsil",
    btn_buy: "Sotib olish",
    btn_add: "Qo'shish",
    wallet_choose_amount: "Miqdorni tanlang",
    wallet_custom_amount: "Boshqa miqdor",
    wallet_payment_card: "To'lov kartasi",
    wallet_card_holder: "Karta egasining ismi",
    wallet_card_number: "Karta raqami",
    wallet_expiry: "Amal qilish muddati",
    wallet_cvv: "CVV",
    wallet_save_card: "Kartani keyingi safar uchun saqlash",
    wallet_topup_btn: "To'ldirish",
    wallet_recent_topups: "So'nggi to'ldirishlar",
    wallet_no_topups_title: "Hali to'ldirishlar yo'q",
    wallet_no_topups_desc:
      "Mablag' qo'shganingizdan so'ng to'ldirishlar tarixi shu yerda ko'rinadi.",

    // ADDED — Valyuta almashish
    exchange_title: "Valyuta almashish",
    exchange_desc:
      "Tangalaringizni haqiqiy AQSH dollariga almashtiring. So'rovlar to'lovdan oldin administrator tomonidan ko'rib chiqiladi.",
    exchange_balance_label: "Tanga balansingiz",
    exchange_available_label: "Almashishga mavjud: {amount}",
    exchange_rate_label: "1000 tanga = $1",
    exchange_form_title: "Tangalarni almashtirish",
    exchange_amount_label: "Tangalar miqdori",
    exchange_amount_placeholder: "1000",
    exchange_you_receive: "Siz olasiz",
    exchange_min_notice: "Almashish uchun kamida 1000 tanga kerak.",
    exchange_insufficient_notice: "Bu miqdor uchun tangalar yetarli emas.",
    exchange_payout_title: "To'lov ma'lumotlari",
    exchange_payment_method_label: "To'lov usuli",
    exchange_payout_details_label: "Hisob / hamyon ma'lumotlari",
    exchange_payout_details_placeholder:
      "Karta raqami, PayPal email, hamyon manzili…",
    exchange_payout_required: "Iltimos, to'lov ma'lumotlarini kiriting.",
    exchange_submit_btn: "Almashinuv so'rash",
    exchange_submitted: "Almashinuv so'rovi ko'rib chiqish uchun yuborildi!",
    exchange_failed: "So'rovni yuborib bo'lmadi. Qayta urinib ko'ring.",
    exchange_not_synced:
      "Balansni tekshirib bo'lmadi — birozdan so'ng qayta urinib ko'ring.",
    exchange_history_title: "Almashinuvlar tarixi",
    exchange_no_history: "Hozircha almashinuv so'rovlari yo'q.",
    exchange_history_error: "Almashinuvlar tarixini yuklab bo'lmadi.",
    exchange_status_pending: "Kutilmoqda",
    exchange_status_approved: "Tasdiqlandi",
    exchange_status_rejected: "Rad etildi",
    exchange_status_completed: "Yakunlandi",

    daily_bonus_title: "Kunlik bonus",
    daily_bonus_desc: "Har 24 soatda bepul mukofot oling.",
    daily_bonus_reward: "+50 tanga",
    daily_bonus_claim_btn: "Mukofotni olish",
    daily_bonus_claimed_btn: "Olindi",
    daily_bonus_next_in: "Keyingi mukofotgacha",
    profile_title: "Profil",
    profile_desc: "Statistikangiz, yutuqlaringiz va hisob sozlamalari.",
    stat_games_owned: "O'yinlar soni",
    stat_hours_played: "O'ynalgan soatlar",
    stat_achievements: "Yutuqlar",
    stat_wishlist: "Istaklar ro'yxati",
    stat_coins: "Tangalar",
    favorite_game_label: "Sevimli o'yin",
    favorites_count_label: "Sevimlilar soni",
    member_since_label: "Ro'yxatdan o'tgan sana",
    achievements_heading: "Yutuqlar",
    settings_heading: "Sozlamalar",
    settings_nickname: "Taxallus",
    settings_avatar: "Avatar",
    settings_theme: "Aksent rangi",
    settings_language: "Til",
    theme_auto: "Avto",
    theme_gold: "Oltin",
    theme_blue: "Ko'k",
    theme_purple: "Binafsha",
    theme_emerald: "Zumrad",
    theme_auto_hint:
      '"Avto" mavzuga mos keladi: Tungi rejimda binafsha, Kunduzgi rejimda zumrad.',
    danger_zone: "Xavfli hudud",
    btn_delete_account: "Hisobni o'chirish",
    btn_change_avatar: "Avatarni o'zgartirish",
    premium_heading: "Pixel&Games Premium",
    premium_status_free: "Oddiy hisob",
    premium_status_active: "Premium a'zo",
    premium_since_label: "Premium sanasi",
    premium_activate_btn: "Premiumni faollashtirish",
    premium_benefits_badge: "Profilda Premium belgisi",
    premium_benefits_border: "Maxsus profil ramkasi",
    premium_benefits_icon: "Oltin Premium belgisi",
    premium_benefits_cosmetic: "Faqat Premium uchun kosmetik effektlar",
    premium_price_label: "Hamyoningizdan bir martalik faollashtirish",
    playtime_heading: "O'yin vaqti",
    playtime_total_hours: "Jami o'ynalgan soatlar",
    playtime_per_game: "Har bir o'yin bo'yicha vaqt",
    recent_activity_heading: "So'nggi faoliyat",
    recent_activity_empty:
      "Hali seanslar yo'q — faoliyatni ko'rish uchun Kutubxonadan o'yin o'ynang.",
    purchase_history_heading: "Xaridlar tarixi",
    purchase_history_empty: "Hali xaridlar yo'q.",
    daily_reward_status_heading: "Kunlik mukofot holati",
    daily_reward_ready: "Olishga tayyor",
    daily_reward_waiting: "Allaqachon olingan — keyinroq qayting",
    total_friends_label: "Jami do'stlar",
    online_friends_label: "Onlayn do'stlar",
    pending_requests_label: "Kutilayotgan so'rovlar",
    friend_requests_heading: "Do'stlik so'rovlari",
    my_friends_heading: "Mening do'stlarim",
    find_players_heading: "O'yinchilarni topish",
    search_players_ph: "O'yinchilarni taxallus bo'yicha qidiring…",
    no_requests_title: "Kutilayotgan so'rovlar yo'q",
    no_requests_desc: "Yangi do'stlik so'rovlari shu yerda ko'rinadi.",

    // ADDED — fullscreen, avatar, bio, country, activity graph
    nav_fullscreen: "To'liq ekran",
    fullscreen_entered: "To'liq ekran rejimi yoqildi",
    fullscreen_exited: "To'liq ekran rejimi o'chirildi",
    btn_upload_avatar: "Rasm yuklash",
    btn_remove_avatar: "Avatarni o'chirish",
    avatar_invalid_file: "Iltimos, rasm faylini tanlang.",
    avatar_uploaded: "Avatar yangilandi.",
    avatar_removed: "Avatar o'chirildi.",
    settings_bio: "Bio",
    ph_bio: "O'zingiz haqingizda boshqa o'yinchilarga yozing…",
    bio_empty_hint:
      "Hali bio yo'q. O'zingiz haqingizda boshqa o'yinchilarga yozing.",
    settings_country: "Davlat",
    country_not_set: "Belgilanmagan",
    country_label: "Davlat",
    member_since_prefix: "A'zo bo'lgan sana",
    activity_graph_heading: "Faollik grafigi",
    activity_legend_logins: "Kirishlar",
    activity_legend_games: "O'ynalgan seanslar",
    activity_legend_purchases: "Xaridlar",
    activity_legend_library: "Kutubxonaga qo'shishlar",
    activity_range_7: "7 kun",
    activity_range_30: "30 kun",
    activity_empty:
      "Hali faollik yo'q. Grafikni to'ldirish uchun o'ynang, tizimga kiring yoki xarid qiling.",
    notif_heading: "Bildirishnomalar",
    notif_empty:
      "Hali bildirishnoma yo'q. Yangiliklarni ko'rish uchun o'yin o'ynang.",
    notif_played_prefix: "O'ynaldi:",

    // ADDED — search system
    search_placeholder: "O'yinlarni qidirish...",
    search_no_results_store: "O'yinlar topilmadi.",
    search_no_results_library: "Kutubxonangizda o'yinlar topilmadi.",

    // ADDED — Recently Played
    recently_played_title: "Yaqinda o'ynalgan",
    recently_played_desc: "So'nggi o'yinlaringizga qayting.",
    recently_played_empty_title: "Hali hech qanday o'yin o'ynalmagan",
    recently_played_empty_desc:
      "Kutubxonadan o'yin ishga tushiring va u shu yerda paydo bo'ladi.",
    btn_play_again: "Yana o'ynash",

    // ADDED — Mystery Box
    mystery_box_title: "Sirli quti",
    mystery_box_desc:
      "Har kuni bitta bepul qutini oching va tasodifiy mukofot oling.",
    mystery_box_open_btn: "Qutini ochish",
    mystery_box_come_back: "Yana bir sirli quti uchun ertaga qayting",
    mystery_box_congrats: "Tabriklaymiz!",
    mystery_box_you_received: "Siz oldingiz",

    // ADDED — Game of the Day
    game_of_the_day_title: "Kunning o'yini",

    // ADDED — Category filters
    category_all: "Barchasi",

    // ADDED — Player Statistics
    player_stats_heading: "O'yinchi statistikasi",
    pstat_games_played: "O'ynalgan o'yinlar",
    pstat_total_playtime: "Jami o'yin vaqti",
    pstat_coins_earned: "Ishlab topilgan tangalar",
    pstat_mystery_boxes: "Ochilgan qutilar",
    pstat_recently_played: "Yaqinda o'ynalgan o'yinlar",

    // ADDED — Profile Badges
    badges_heading: "Profil nishonlari",
    badge_state_locked: "Qulflangan",
    badge_state_unlocked: "Ochilgan",
    badge_unlocked_toast: "Nishon ochildi",
    badge_select_favorite_hint: "Profilingizda ko'rsatish uchun bosing",
    badge_first_player_name: "Birinchi o'yinchi",
    badge_first_player_desc: "Birinchi o'yiningizni ishga tushiring.",
    badge_game_explorer_name: "O'yin tadqiqotchisi",
    badge_game_explorer_desc: "5 ta turli o'yinni o'ynang.",
    badge_mystery_hunter_name: "Sir ovchisi",
    badge_mystery_hunter_desc: "Sirli qutini oching.",
    badge_coin_collector_name: "Tanga yig'uvchi",
    badge_coin_collector_desc: "Jami 1000 tanga ishlab toping.",
    badge_premium_player_name: "Premium o'yinchi",
    badge_premium_player_desc: "Premium a'zo bo'ling.",
    badge_game_collector_name: "O'yin kolleksioneri",
    badge_game_collector_desc: "8 ta turli o'yinni o'ynang yoki egallang.",
  },
};

function getCurrentLanguage() {
  return localStorage.getItem(LANG_KEY) || "en";
}

/* ADDED — translation helper for JS-rendered (non data-i18n) strings */
function t(key, vars) {
  const dict = I18N[getCurrentLanguage()] || I18N.en;
  let str =
    dict[key] !== undefined
      ? dict[key]
      : I18N.en[key] !== undefined
        ? I18N.en[key]
        : key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace("{" + k + "}", vars[k]);
    });
  }
  return str;
}

/* ADDED — re-render whichever view is currently visible so JS-templated
   (non data-i18n) text updates immediately on language change */
function refreshDynamicViews() {
  [
    "store",
    "library",
    "wallet",
    "exchange",
    "profile",
    "friends",
    "partnership",
    "advertisements",
  ].forEach((v) => {
    const el = document.getElementById(v + "View");
    if (el && !el.classList.contains("hidden")) {
      if (v === "store") renderStore();
      if (v === "library") renderLibrary();
      if (v === "wallet") renderWallet();
      if (v === "exchange") renderExchange();
      if (v === "profile") renderProfile();
      if (v === "friends") renderFriendsView();
    }
  });
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll(".lang-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function selectLanguage(lang) {
  const langScreen = document.getElementById("languageScreen");
  const wasVisible = langScreen.style.display !== "none";
  localStorage.setItem(LANG_KEY, lang);
  langScreen.style.display = "none";
  applyLanguage(lang);
  if (typeof refreshDynamicViews === "function") refreshDynamicViews();
  if (!wasVisible && typeof toast === "function") {
    const names = { en: "English", ru: "Русский", uz: "O'zbekcha" };
    toast("Language set to " + (names[lang] || lang) + ".");
  }
}

// Apply saved language once the full page has parsed (this script runs before
// the rest of the body exists in the DOM, so we wait for DOMContentLoaded).
document.addEventListener("DOMContentLoaded", function () {
  applyLanguage(getCurrentLanguage());
});

/* ============================================================
   ADDED — STORE PROMO CAROUSEL
   Auto-rotating hero banner above the store search bar. Slide text
   is handled by the existing data-i18n system (see I18N above), so
   it updates automatically whenever applyLanguage() runs.
   ============================================================ */
let storePromoCarouselTimer = null;
let storePromoCarouselIndex = 0;

function goToStorePromoSlide(index) {
  const track = document.getElementById("storePromoTrack");
  if (!track) return;
  const slides = track.querySelectorAll(".promo-slide");
  const dots = document.querySelectorAll("#storePromoDots .promo-dot");
  if (!slides.length) return;
  storePromoCarouselIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === storePromoCarouselIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === storePromoCarouselIndex);
  });
}

function advanceStorePromoSlide() {
  goToStorePromoSlide(storePromoCarouselIndex + 1);
}

function initStorePromoCarousel() {
  const carousel = document.getElementById("storePromoCarousel");
  if (!carousel) return;
  goToStorePromoSlide(0);
  if (storePromoCarouselTimer) clearInterval(storePromoCarouselTimer);
  storePromoCarouselTimer = setInterval(advanceStorePromoSlide, 3000);

  const dots = document.querySelectorAll("#storePromoDots .promo-dot");
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToStorePromoSlide(parseInt(dot.dataset.index, 10) || 0);
      if (storePromoCarouselTimer) clearInterval(storePromoCarouselTimer);
      storePromoCarouselTimer = setInterval(advanceStorePromoSlide, 3000);
    });
  });
}
document.addEventListener("DOMContentLoaded", initStorePromoCarousel);

/* ============================================================
   ADDED — FULLSCREEN MODE
   ============================================================ */
function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}
function updateFullscreenButton() {
  const btn = document.getElementById("fullscreenBtn");
  const enterIcon = document.getElementById("fsIconEnter");
  const exitIcon = document.getElementById("fsIconExit");
  const label = document.getElementById("fullscreenBtnLabel");
  if (!btn) return;
  const active = isFullscreenActive();
  btn.classList.toggle("is-fullscreen", active);
  if (enterIcon) enterIcon.classList.toggle("hidden", active);
  if (exitIcon) exitIcon.classList.toggle("hidden", !active);
  if (label) label.textContent = t("nav_fullscreen");
}
function toggleFullscreen() {
  if (!isFullscreenActive()) {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    if (req) req.call(el);
  } else {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    if (exit) exit.call(document);
  }
}
["fullscreenchange", "webkitfullscreenchange", "msfullscreenchange"].forEach(
  (evt) => {
    document.addEventListener(evt, function () {
      updateFullscreenButton();
      toast(
        isFullscreenActive() ? t("fullscreen_entered") : t("fullscreen_exited"),
      );
    });
  },
);
document.addEventListener("DOMContentLoaded", updateFullscreenButton);

/* ============================================================
   ADDED — SITE-WIDE LIGHT / DARK THEME
   Instant switch (just flips a data-theme attribute the whole
   stylesheet reacts to via CSS variables) + persisted so it survives
   a refresh.
   Works together with the site-wide ACCENT COLOR system below: the
   accent's default (Purple in Dark, Emerald in Light) is resolved
   entirely in CSS via the data-theme + data-accent attributes, so
   toggling light/dark here automatically re-shades the accent too
   whenever the user's accent choice is "auto".
   ============================================================ */
const SITE_THEME_KEY = "pixelgames_theme";

function getSiteTheme() {
  try {
    return localStorage.getItem(SITE_THEME_KEY) || "dark";
  } catch (e) {
    return "dark";
  }
}
function updateThemeToggleButton(theme) {
  const sunIcon = document.getElementById("themeIconSun");
  const moonIcon = document.getElementById("themeIconMoon");
  if (sunIcon) sunIcon.classList.toggle("hidden", theme !== "dark");
  if (moonIcon) moonIcon.classList.toggle("hidden", theme === "dark");
  // ADDED — keep the accent popover's own light/dark switch in sync
  const modeSunIcon = document.getElementById("accentModeIconSun");
  const modeMoonIcon = document.getElementById("accentModeIconMoon");
  const modeLabel = document.getElementById("accentModeLabel");
  if (modeSunIcon) modeSunIcon.classList.toggle("hidden", theme !== "dark");
  if (modeMoonIcon) modeMoonIcon.classList.toggle("hidden", theme === "dark");
  if (modeLabel) modeLabel.textContent = theme === "light" ? "Light Mode" : "Dark Mode";
}
function applySiteTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggleButton(theme);
}
function toggleSiteTheme() {
  const next = getSiteTheme() === "light" ? "dark" : "light";
  try {
    localStorage.setItem(SITE_THEME_KEY, next);
  } catch (e) {}
  applySiteTheme(next);
}

/* ============================================================
   ADDED — SITE-WIDE ACCENT COLOR
   Reads the logged-in user's chosen accent ("auto", "purple",
   "emerald", "blue", or "gold") and applies it as a data-accent
   attribute on <html>. The actual color values live in style.css
   as CSS variables (--accent / --accent-bright / --accent-rgb),
   so every component that already uses them repaints instantly —
   no per-component JS needed.
   ============================================================ */
function applySiteAccent(accent) {
  document.documentElement.setAttribute("data-accent", accent || "auto");
}
function syncSiteAccentFromUser() {
  const user = currentUser();
  applySiteAccent(user ? user.theme || "auto" : "auto");
}
// Sync the toggle button's icon with whatever theme was already applied
// by the anti-flash script in <head> (attribute is set before this runs).
document.addEventListener("DOMContentLoaded", function () {
  applySiteTheme(getSiteTheme());
  syncSiteAccentFromUser();
  restoreAccentOverride();
  restoreBackground();
});

/* ============================================================
   ADDED — ACCENT COLOR CUSTOMIZATION POPOVER
   Opens from the existing light/dark theme button. Lets the user
   pick one of 7 preset colors or a fully custom color via an HTML
   color input. Reuses the existing accent CSS-variable architecture
   (--accent / --accent-bright / --accent-rgb) — it just applies the
   chosen color as an inline style on <html>, which naturally takes
   priority over the [data-accent] presets and the light/dark
   defaults, without touching either of those systems. Persisted in
   localStorage, independent of the light/dark theme setting.
   ============================================================ */
const ACCENT_OVERRIDE_KEY = "pixelgames_accent_override";

function hexToRgbString(hex) {
  const full =
    hex.replace("#", "").length === 3
      ? hex
          .replace("#", "")
          .split("")
          .map((c) => c + c)
          .join("")
      : hex.replace("#", "");
  const bigint = parseInt(full, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255].join(",");
}
function lightenHex(hex, amount) {
  const full =
    hex.replace("#", "").length === 3
      ? hex
          .replace("#", "")
          .split("")
          .map((c) => c + c)
          .join("")
      : hex.replace("#", "");
  const bigint = parseInt(full, 16);
  const r = Math.round(((bigint >> 16) & 255) + (255 - ((bigint >> 16) & 255)) * amount);
  const g = Math.round(((bigint >> 8) & 255) + (255 - ((bigint >> 8) & 255)) * amount);
  const b = Math.round((bigint & 255) + (255 - (bigint & 255)) * amount);
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}
function applyAccentOverride(hex, brightHex) {
  const bright = brightHex || lightenHex(hex, 0.25);
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-bright", bright);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgbString(hex));
}
function loadAccentOverride() {
  try {
    const raw = localStorage.getItem(ACCENT_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveAccentOverride(hex, bright) {
  try {
    localStorage.setItem(ACCENT_OVERRIDE_KEY, JSON.stringify({ hex: hex, bright: bright }));
  } catch (e) {}
}
function restoreAccentOverride() {
  const saved = loadAccentOverride();
  if (saved && saved.hex) applyAccentOverride(saved.hex, saved.bright);
}
function selectAccentPreset(btn) {
  const hex = btn.getAttribute("data-color");
  const bright = btn.getAttribute("data-bright");
  applyAccentOverride(hex, bright);
  saveAccentOverride(hex, bright);
  renderAccentPopover();
}
function selectCustomAccentColor(hex) {
  const bright = lightenHex(hex, 0.25);
  applyAccentOverride(hex, bright);
  saveAccentOverride(hex, bright);
  renderAccentPopover();
}
function resetAccentToDefault() {
  document.documentElement.style.removeProperty("--accent");
  document.documentElement.style.removeProperty("--accent-bright");
  document.documentElement.style.removeProperty("--accent-rgb");
  try {
    localStorage.removeItem(ACCENT_OVERRIDE_KEY);
  } catch (e) {}
  renderAccentPopover();
}
function renderAccentPopover() {
  const saved = loadAccentOverride();
  document.querySelectorAll("#accentPresetGrid .accent-swatch").forEach((btn) => {
    const isActive =
      !!saved &&
      !!saved.hex &&
      saved.hex.toLowerCase() === (btn.getAttribute("data-color") || "").toLowerCase();
    btn.classList.toggle("active", isActive);
  });
  const customInput = document.getElementById("accentCustomInput");
  if (customInput && saved && saved.hex) customInput.value = saved.hex;
}
function toggleAccentPopover(event) {
  if (event) event.stopPropagation();
  closeNotifications();
  closeUserMenu();
  const pop = document.getElementById("accentPopover");
  if (!pop) return;
  const willOpen = pop.classList.contains("hidden");
  pop.classList.toggle("hidden");
  if (willOpen) {
    renderAccentPopover();
    renderBackgroundPopover();
  }
}
function closeAccentPopover() {
  const pop = document.getElementById("accentPopover");
  if (pop) pop.classList.add("hidden");
}

/* ============================================================
   ADDED — BACKGROUND CUSTOMIZATION
   Lives in the same popover as the accent color picker above, and
   is completely independent from it: it only ever touches the
   --page-bg-1 / --page-bg-2 / --page-bg-base CSS variables (which
   solely drive the body's ambient background in style.css), so the
   light/dark theme and the accent color are never affected by a
   background change, and vice versa. Persisted separately in
   localStorage, and restored on load alongside theme + accent.
   ============================================================ */
const BACKGROUND_KEY = "pixelgames_background";
const BACKGROUND_PRESETS = [
  "default",
  "ocean",
  "galaxy",
  "aurora",
  "matrix",
  "sakura",
  "volcanic",
  "neon-city",
];

/* ---- lightweight particle generation for the animated fx layers ----
   Each generator runs once (guarded by a "filled" flag) and creates a
   modest number of small absolutely-positioned spans driven purely by
   CSS animations (transform/opacity), so there's no per-frame JS and
   no layout thrashing. Layers the user never selects are never filled. */
const bgFxFilled = {};
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function fillGalaxyStars() {
  const layer = document.getElementById("fxGalaxy");
  if (!layer || bgFxFilled.galaxy) return;
  bgFxFilled.galaxy = true;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 55; i++) {
    const star = document.createElement("span");
    const size = rand(1, 2.6);
    star.className = "star";
    star.style.left = rand(0, 100) + "%";
    star.style.top = rand(0, 100) + "%";
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.setProperty("--dur", rand(2.5, 6) + "s");
    star.style.setProperty("--delay", rand(0, 5) + "s");
    frag.appendChild(star);
  }
  layer.appendChild(frag);
}
function fillMatrixColumns() {
  const layer = document.getElementById("fxMatrix");
  if (!layer || bgFxFilled.matrix) return;
  bgFxFilled.matrix = true;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 22; i++) {
    const col = document.createElement("span");
    col.className = "matrix-col";
    col.style.left = rand(0, 100) + "%";
    col.style.height = rand(70, 170) + "px";
    col.style.setProperty("--dur", rand(4, 9) + "s");
    col.style.setProperty("--delay", rand(-8, 0) + "s");
    frag.appendChild(col);
  }
  layer.appendChild(frag);
}
function fillSakuraPetals() {
  const layer = document.getElementById("fxSakura");
  if (!layer || bgFxFilled.sakura) return;
  bgFxFilled.sakura = true;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 16; i++) {
    const petal = document.createElement("span");
    const size = rand(6, 13);
    petal.className = "petal";
    petal.style.left = rand(0, 100) + "%";
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    petal.style.setProperty("--dur", rand(10, 19) + "s");
    petal.style.setProperty("--delay", rand(-16, 0) + "s");
    petal.style.setProperty("--drift", rand(-70, 70) + "px");
    frag.appendChild(petal);
  }
  layer.appendChild(frag);
}
function fillVolcanicEmbers() {
  const layer = document.getElementById("fxVolcanic");
  if (!layer || bgFxFilled.volcanic) return;
  bgFxFilled.volcanic = true;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 20; i++) {
    const ember = document.createElement("span");
    ember.className = "ember";
    ember.style.left = rand(0, 100) + "%";
    ember.style.setProperty("--dur", rand(6, 11) + "s");
    ember.style.setProperty("--delay", rand(-10, 0) + "s");
    ember.style.setProperty("--drift", rand(-30, 30) + "px");
    frag.appendChild(ember);
  }
  layer.appendChild(frag);
}
function ensureBgFxParticles(name) {
  if (name === "galaxy") fillGalaxyStars();
  else if (name === "matrix") fillMatrixColumns();
  else if (name === "sakura") fillSakuraPetals();
  else if (name === "volcanic") fillVolcanicEmbers();
}

function applyBackgroundPreset(name) {
  document.documentElement.setAttribute("data-bg", name || "default");
  // A manual preset always wins over any previous custom color override.
  document.documentElement.style.removeProperty("--page-bg-1");
  document.documentElement.style.removeProperty("--page-bg-2");
  document.documentElement.style.removeProperty("--page-bg-base");
  ensureBgFxParticles(name);
}
function applyCustomBackground(hex) {
  // A custom color always wins over any preset attribute.
  document.documentElement.removeAttribute("data-bg");
  document.documentElement.style.setProperty("--page-bg-base", hex);
  document.documentElement.style.setProperty("--page-bg-1", "rgba(255,255,255,0.05)");
  document.documentElement.style.setProperty("--page-bg-2", "rgba(0,0,0,0.14)");
}
function resetBackgroundVars() {
  document.documentElement.removeAttribute("data-bg");
  document.documentElement.style.removeProperty("--page-bg-1");
  document.documentElement.style.removeProperty("--page-bg-2");
  document.documentElement.style.removeProperty("--page-bg-base");
}
function loadBackground() {
  try {
    const raw = localStorage.getItem(BACKGROUND_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveBackground(data) {
  try {
    localStorage.setItem(BACKGROUND_KEY, JSON.stringify(data));
  } catch (e) {}
}
function restoreBackground() {
  const saved = loadBackground();
  if (!saved) return;
  if (saved.type === "custom" && saved.value) {
    applyCustomBackground(saved.value);
  } else if (saved.type === "preset" && saved.value && saved.value !== "default") {
    applyBackgroundPreset(saved.value);
  }
}
function selectBackgroundPreset(btn) {
  const name = btn.getAttribute("data-bg-name") || "default";
  applyBackgroundPreset(name);
  if (name === "default") {
    try {
      localStorage.removeItem(BACKGROUND_KEY);
    } catch (e) {}
  } else {
    saveBackground({ type: "preset", value: name });
  }
  renderBackgroundPopover();
}
function selectCustomBackgroundColor(hex) {
  applyCustomBackground(hex);
  saveBackground({ type: "custom", value: hex });
  renderBackgroundPopover();
}
function resetBackgroundToDefault() {
  resetBackgroundVars();
  try {
    localStorage.removeItem(BACKGROUND_KEY);
  } catch (e) {}
  renderBackgroundPopover();
}
function renderBackgroundPopover() {
  const saved = loadBackground();
  document.querySelectorAll("#bgPresetGrid .bg-chip").forEach((btn) => {
    const name = btn.getAttribute("data-bg-name");
    const isActive =
      (saved && saved.type === "preset" && saved.value === name) ||
      (!saved && name === "default");
    btn.classList.toggle("active", !!isActive);
  });
  const customInput = document.getElementById("bgCustomInput");
  if (customInput && saved && saved.type === "custom" && saved.value) {
    customInput.value = saved.value;
  }
}

/* ============================================================
   ADDED — TOP NAV: mobile hamburger menu
   ============================================================ */
function toggleMobileNav(event) {
  if (event) event.stopPropagation();
  if (window.innerWidth >= 1024) return; // desktop never uses the mobile menu
  const nav = document.getElementById("topnavCenter");
  if (!nav) return;
  nav.classList.toggle("mobile-nav-open");
}
function closeMobileNav() {
  const nav = document.getElementById("topnavCenter");
  if (nav) nav.classList.remove("mobile-nav-open");
}
// ADDED — if the viewport crosses into desktop width while the mobile menu
// is open, close it so it can never linger/overlap the full nav.
window.addEventListener("resize", function () {
  if (window.innerWidth >= 1024) closeMobileNav();
});

/* ============================================================
   ADDED — TOP NAV: notifications dropdown
   (read-only view built from each user's existing recent-activity log;
   no new tracking or data is introduced)
   ============================================================ */
function toggleNotifications(event) {
  if (event) event.stopPropagation();
  closeUserMenu();
  closeAccentPopover();
  const dd = document.getElementById("notifDropdown");
  if (!dd) return;
  const willOpen = dd.classList.contains("hidden");
  dd.classList.toggle("hidden");
  if (willOpen) renderNotifications();
}
function closeNotifications() {
  const dd = document.getElementById("notifDropdown");
  if (dd) dd.classList.add("hidden");
}
function renderNotifications() {
  const list = document.getElementById("notifList");
  const dot = document.getElementById("notifDot");
  if (!list) return;
  const user = currentUser();
  const items =
    user && user.recentActivity ? user.recentActivity.slice(0, 8) : [];
  if (dot) dot.classList.toggle("hidden", items.length === 0);
  if (!items.length) {
    list.innerHTML = `<div class="notif-empty">${t("notif_empty")}</div>`;
    return;
  }
  list.innerHTML = items
    .map((item) => {
      const mins = Math.max(1, Math.round((item.durationSeconds || 0) / 60));
      const when = new Date(item.date);
      const timeStr = when.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `
      <div class="notif-item">
        <div class="notif-item-icon">🎮</div>
        <div>
          <div class="notif-item-text">${t("notif_played_prefix")} ${item.title} — ${mins}m</div>
          <div class="notif-item-time">${timeStr}</div>
        </div>
      </div>`;
    })
    .join("");
}

/* ============================================================
   ADDED — TOP NAV: user dropdown menu
   ============================================================ */
function toggleUserMenu(event) {
  if (event) event.stopPropagation();
  closeNotifications();
  closeAccentPopover();
  const menu = document.getElementById("userDropdownMenu");
  const btn = document.getElementById("topnavUser");
  if (!menu) return;
  menu.classList.toggle("hidden");
  if (btn)
    btn.setAttribute(
      "aria-expanded",
      menu.classList.contains("hidden") ? "false" : "true",
    );
}
function closeUserMenu() {
  const menu = document.getElementById("userDropdownMenu");
  const btn = document.getElementById("topnavUser");
  if (menu) menu.classList.add("hidden");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

// Close any open dropdown when clicking outside of it, and on ESC.
document.addEventListener("click", function (e) {
  const notifWrap = document.querySelector(".topnav-notif-wrap");
  const userWrap = document.querySelector(".topnav-user-wrap");
  const themeWrap = document.querySelector(".topnav-theme-wrap");
  if (notifWrap && !notifWrap.contains(e.target)) closeNotifications();
  if (userWrap && !userWrap.contains(e.target)) closeUserMenu();
  if (themeWrap && !themeWrap.contains(e.target)) closeAccentPopover();
  const nav = document.getElementById("topnavCenter");
  const menuBtn = document.getElementById("mobileMenuBtn");
  if (
    nav &&
    nav.classList.contains("mobile-nav-open") &&
    !nav.contains(e.target) &&
    e.target !== menuBtn &&
    !(menuBtn && menuBtn.contains(e.target))
  ) {
    closeMobileNav();
  }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeNotifications();
    closeUserMenu();
    closeAccentPopover();
    closeMobileNav();
  }
});

/* ============================================================
   ADDED — COUNTRY LIST (name + ISO code; flag emoji is derived
   programmatically from the ISO code, not hard-coded)
   ============================================================ */
const COUNTRIES = [
  ["AF", "Afghanistan"],
  ["AL", "Albania"],
  ["DZ", "Algeria"],
  ["AD", "Andorra"],
  ["AO", "Angola"],
  ["AR", "Argentina"],
  ["AM", "Armenia"],
  ["AU", "Australia"],
  ["AT", "Austria"],
  ["AZ", "Azerbaijan"],
  ["BS", "Bahamas"],
  ["BH", "Bahrain"],
  ["BD", "Bangladesh"],
  ["BY", "Belarus"],
  ["BE", "Belgium"],
  ["BZ", "Belize"],
  ["BJ", "Benin"],
  ["BT", "Bhutan"],
  ["BO", "Bolivia"],
  ["BA", "Bosnia and Herzegovina"],
  ["BW", "Botswana"],
  ["BR", "Brazil"],
  ["BN", "Brunei"],
  ["BG", "Bulgaria"],
  ["BF", "Burkina Faso"],
  ["BI", "Burundi"],
  ["KH", "Cambodia"],
  ["CM", "Cameroon"],
  ["CA", "Canada"],
  ["CV", "Cabo Verde"],
  ["CF", "Central African Republic"],
  ["TD", "Chad"],
  ["CL", "Chile"],
  ["CN", "China"],
  ["CO", "Colombia"],
  ["KM", "Comoros"],
  ["CG", "Congo"],
  ["CD", "DR Congo"],
  ["CR", "Costa Rica"],
  ["HR", "Croatia"],
  ["CU", "Cuba"],
  ["CY", "Cyprus"],
  ["CZ", "Czechia"],
  ["DK", "Denmark"],
  ["DJ", "Djibouti"],
  ["DM", "Dominica"],
  ["DO", "Dominican Republic"],
  ["EC", "Ecuador"],
  ["EG", "Egypt"],
  ["SV", "El Salvador"],
  ["GQ", "Equatorial Guinea"],
  ["ER", "Eritrea"],
  ["EE", "Estonia"],
  ["SZ", "Eswatini"],
  ["ET", "Ethiopia"],
  ["FJ", "Fiji"],
  ["FI", "Finland"],
  ["FR", "France"],
  ["GA", "Gabon"],
  ["GM", "Gambia"],
  ["GE", "Georgia"],
  ["DE", "Germany"],
  ["GH", "Ghana"],
  ["GR", "Greece"],
  ["GD", "Grenada"],
  ["GT", "Guatemala"],
  ["GN", "Guinea"],
  ["GW", "Guinea-Bissau"],
  ["GY", "Guyana"],
  ["HT", "Haiti"],
  ["HN", "Honduras"],
  ["HU", "Hungary"],
  ["IS", "Iceland"],
  ["IN", "India"],
  ["ID", "Indonesia"],
  ["IR", "Iran"],
  ["IQ", "Iraq"],
  ["IE", "Ireland"],
  ["IL", "Israel"],
  ["IT", "Italy"],
  ["JM", "Jamaica"],
  ["JP", "Japan"],
  ["JO", "Jordan"],
  ["KZ", "Kazakhstan"],
  ["KE", "Kenya"],
  ["KI", "Kiribati"],
  ["KP", "North Korea"],
  ["KR", "South Korea"],
  ["KW", "Kuwait"],
  ["KG", "Kyrgyzstan"],
  ["LA", "Laos"],
  ["LV", "Latvia"],
  ["LB", "Lebanon"],
  ["LS", "Lesotho"],
  ["LR", "Liberia"],
  ["LY", "Libya"],
  ["LI", "Liechtenstein"],
  ["LT", "Lithuania"],
  ["LU", "Luxembourg"],
  ["MG", "Madagascar"],
  ["MW", "Malawi"],
  ["MY", "Malaysia"],
  ["MV", "Maldives"],
  ["ML", "Mali"],
  ["MT", "Malta"],
  ["MH", "Marshall Islands"],
  ["MR", "Mauritania"],
  ["MU", "Mauritius"],
  ["MX", "Mexico"],
  ["FM", "Micronesia"],
  ["MD", "Moldova"],
  ["MC", "Monaco"],
  ["MN", "Mongolia"],
  ["ME", "Montenegro"],
  ["MA", "Morocco"],
  ["MZ", "Mozambique"],
  ["MM", "Myanmar"],
  ["NA", "Namibia"],
  ["NR", "Nauru"],
  ["NP", "Nepal"],
  ["NL", "Netherlands"],
  ["NZ", "New Zealand"],
  ["NI", "Nicaragua"],
  ["NE", "Niger"],
  ["NG", "Nigeria"],
  ["MK", "North Macedonia"],
  ["NO", "Norway"],
  ["OM", "Oman"],
  ["PK", "Pakistan"],
  ["PW", "Palau"],
  ["PA", "Panama"],
  ["PG", "Papua New Guinea"],
  ["PY", "Paraguay"],
  ["PE", "Peru"],
  ["PH", "Philippines"],
  ["PL", "Poland"],
  ["PT", "Portugal"],
  ["QA", "Qatar"],
  ["RO", "Romania"],
  ["RU", "Russia"],
  ["RW", "Rwanda"],
  ["KN", "Saint Kitts and Nevis"],
  ["LC", "Saint Lucia"],
  ["VC", "Saint Vincent and the Grenadines"],
  ["WS", "Samoa"],
  ["SM", "San Marino"],
  ["ST", "Sao Tome and Principe"],
  ["SA", "Saudi Arabia"],
  ["SN", "Senegal"],
  ["RS", "Serbia"],
  ["SC", "Seychelles"],
  ["SL", "Sierra Leone"],
  ["SG", "Singapore"],
  ["SK", "Slovakia"],
  ["SI", "Slovenia"],
  ["SB", "Solomon Islands"],
  ["SO", "Somalia"],
  ["ZA", "South Africa"],
  ["SS", "South Sudan"],
  ["ES", "Spain"],
  ["LK", "Sri Lanka"],
  ["SD", "Sudan"],
  ["SR", "Suriname"],
  ["SE", "Sweden"],
  ["CH", "Switzerland"],
  ["SY", "Syria"],
  ["TW", "Taiwan"],
  ["TJ", "Tajikistan"],
  ["TZ", "Tanzania"],
  ["TH", "Thailand"],
  ["TL", "Timor-Leste"],
  ["TG", "Togo"],
  ["TO", "Tonga"],
  ["TT", "Trinidad and Tobago"],
  ["TN", "Tunisia"],
  ["TR", "Turkey"],
  ["TM", "Turkmenistan"],
  ["TV", "Tuvalu"],
  ["UG", "Uganda"],
  ["UA", "Ukraine"],
  ["AE", "United Arab Emirates"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["UY", "Uruguay"],
  ["UZ", "Uzbekistan"],
  ["VU", "Vanuatu"],
  ["VA", "Vatican City"],
  ["VE", "Venezuela"],
  ["VN", "Vietnam"],
  ["YE", "Yemen"],
  ["ZM", "Zambia"],
  ["ZW", "Zimbabwe"],
];
function countryFlagEmoji(code) {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}
function countryNameByCode(code) {
  const entry = COUNTRIES.find((c) => c[0] === code);
  return entry ? entry[1] : "";
}
function populateCountrySelect() {
  const sel = document.getElementById("countrySelect");
  if (!sel) return;
  const prevValue = sel.value;
  const sorted = COUNTRIES.slice().sort((a, b) => a[1].localeCompare(b[1]));
  sel.innerHTML =
    '<option value="">' +
    t("country_not_set") +
    "</option>" +
    sorted
      .map(
        ([code, name]) =>
          `<option value="${code}">${countryFlagEmoji(code)} ${name}</option>`,
      )
      .join("");
  sel.value = prevValue;
}

/* ============================================================
   ADDED — localized month names for "Member since" (independent
   of browser locale, always follows the app's selected language)
   ============================================================ */
const MONTH_NAMES = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
};
function formatMemberSince(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  const lang = getCurrentLanguage();
  const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ============================================================
   Pixel&Games — catalog (placeholder data, replace paths later)
   ============================================================ */
const CATALOG = [
  {
    id: "g1",
    title: "SHADOWRITE",
    image: "assets/games/shadowrite.webp",
    tag: "Shooter",
    color1: "#1e1b2e",
    color2: "#4b2f6b",
    blurb:
      "Fight through intense battles, survive against dangerous enemies, and master the dark world of SHADOWRITE.",
    path: "https://my-game-chi-three.vercel.app/",
    price: 0,
  },

  {
    id: "g2",
    title: "AIM BOT",
    image: "assets/games/aim-bot.webp",
    tag: "Aim Trainer",
    color1: "#16323a",
    color2: "#2f6b63",
    blurb:
      "Train your reflexes, improve your accuracy, and become the ultimate sharpshooter.",
    path: "https://aim-game-iota.vercel.app/",
    price: 0,
  },

  {
    id: "g3",
    title: "MARS OUTPOST",
    image: "assets/games/mars-outpost.webp",
    tag: "3D Sci-Fi Survival",
    color1: "#5a341f",
    color2: "#c56b2d",
    blurb:
      "Survive alone on an abandoned Mars colony, restore critical systems, uncover the mystery of the missing crew, and send humanity’s last signal back to Earth.",
    path: "https://js-game-ochre-xi.vercel.app/",
    price: 13.99,
  },

  {
    id: "g4",
    title: "PROJECT: ECHO",
    image: "assets/games/project-echo.webp",
    tag: "3D Horror Adventure",
    color1: "#2a1f2f",
    color2: "#4a2f52",
    blurb:
      "Explore an abandoned underground research facility, solve mysterious puzzles, and survive the darkness while uncovering the truth behind PROJECT: ECHO.",
    path: "https://horor-game.vercel.app/",
    price: 12.99,
  },

  {
    id: "g5",
    title: "NEON DRIFT",
    image: "assets/games/neon-drift.webp",
    tag: "3D Arcade Racing",
    color1: "#1f2f3a",
    color2: "#2f5a6b",
    blurb:
      "Race through a futuristic neon city, master high-speed drifts, activate Nitro Boost, and become the fastest driver on the streets.",
    path: "https://racing-game-five-orpin.vercel.app/",
    price: 8.99,
  },

  {
    id: "g6",
    title: "TREASURE HUNTER",
    image: "assets/games/treasure-hunter.webp",
    tag: "3D Adventure",
    color1: "#3a2f1f",
    color2: "#6b5a2f",
    blurb:
      "Explore ancient temples, solve dangerous puzzles, uncover legendary treasures, and escape deadly traps before it is too late.",
    path: "https://treasure-hunter-virid.vercel.app/",
    price: 4.99,
  },

  {
    id: "g7",
    title: "SKYBOUND",
    image: "assets/games/skybound.webp",
    tag: "3D Open World Adventure",
    color1: "#2a4f7a",
    color2: "#5bb6ff",
    blurb:
      "Explore breathtaking floating islands, uncover ancient secrets, collect magical crystals, and discover the legendary Sky Core hidden above the clouds.",
    path: "https://skybound-psi.vercel.app/",
    price: 2.99,
  },

  {
    id: "g8",
    title: "KINGDOM FALL",
    image: "assets/games/kingdom-fall.webp",
    tag: "3D Action RPG",
    color1: "#4b2c1d",
    color2: "#b67a3d",
    blurb:
      "Fight through a fallen kingdom, defeat legendary bosses, collect powerful weapons, and restore hope to a land consumed by darkness.",
    path: "https://kingdom-fall.vercel.app/",
    price: 0,
  },

  {
    id: "g9",
    title: "PHANTOM OPS",
    image: "assets/games/phantom-ops.webp",
    tag: "3D Stealth Action",
    color1: "#1f2a35",
    color2: "#3b556e",
    blurb:
      "Infiltrate military facilities, avoid enemy patrols, hack advanced security systems, and complete dangerous covert missions without being detected.",
    path: "https://phantom-ops.vercel.app/",
    price: 3.99,
  },

  {
    id: "g10",
    title: "LAST HORIZON",
    image: "assets/games/last-horizon.webp",
    tag: "3D Open World Survival",
    color1: "#4b5d42",
    color2: "#8fa96b",
    blurb:
      "Survive in a ruined world, gather resources, build shelters, and uncover the mystery behind humanity’s collapse.",
    path: "https://3-d-open-world-survival.vercel.app/",
    price: 9.99,
  },

  {
  id: "g11",
  title: "PIXEL RUSH",
  image: "assets/games/pixel-rush.webp",
  tag: "Neon Arcade Racing",
  color1: "#151a3d",
  color2: "#8b5cf6",
  blurb:
    "Race through neon tracks, master sharp turns, drift at high speed, and compete for the fastest time in the ultimate Pixel&Games arcade racing experience.",
  path: "https://git-push-puce.vercel.app",
  price: 1.99,
},

{
  id: "g12",
  title: "PIXEL TIC-TAC-TOE",
  image: "assets/games/pixel-tic-tac-toe.webp",
  tag: "Neon Strategy Classic",
  color1: "#101828",
  color2: "#7c3aed",
  blurb:
    "Challenge a powerful AI or a friend in a modern neon version of the classic Tic-Tac-Toe game. Master different difficulty levels, unlock unique themes, earn coins, and build your winning streak.",
  path: "https://tic-tac-alpha-six.vercel.app",
  price: 0,
},

{
  id: "g13",
  title: "PIXEL SNAKE",
  image: "assets/games/pixel-snake.webp",
  tag: "Neon Arcade Classic",
  color1: "#071a1f",
  color2: "#00e5ff",
  blurb:
    "Grow your neon snake, collect special food, unlock unique skins, complete missions, and chase the highest score in this modern neon arcade classic.",
  path: "https://snake-games-three.vercel.app/",
  price: 0,
},
];

/* ============================================================
   ADDED — avatars, achievements, wallet presets (design only)
   ============================================================ */
const AVATARS = [
  "🎮",
  "🛡️",
  "🐉",
  "⚔️",
  "🌙",
  "🔥",
  "⚡",
  "👾",
  "🤪",
  "👻",
  "👿",
  "🤡",
  "☠️",
  "🧓",
  "🕺",
  "🤵",
  "👨‍🦳",
  "👨‍🦲",
  "👨‍🦰",
  "🧔",
  "🧑‍🦱",
  "🦾",
  "👅",
  "👳‍♂️",
  "💨",
  "💫",
  "🤟",
  "👊",
  "🫀",
  "🧠",
];

const ACHIEVEMENTS = [
  {
    id: "first_login",
    name: "First Login",
    icon: "🔑",
    desc: "Entered the Vault for the first time.",
    check: (u) => true,
  },
  {
    id: "first_topup",
    name: "First Top-Up",
    icon: "💎",
    desc: "Added funds to your wallet.",
    check: (u) => u.topups.length >= 1,
  },
  {
    id: "first_game",
    name: "First Game Added",
    icon: "🎮",
    desc: "Added a game to your library.",
    check: (u) => u.library.length >= 1,
  },
  {
    id: "first_favorite",
    name: "First Favorite",
    icon: "⭐",
    desc: "Marked a game as a favorite.",
    check: (u) => u.favorites.length >= 1,
  },
  {
    id: "collector",
    name: "Collector",
    icon: "📦",
    desc: "Own 4 or more games.",
    check: (u) => u.library.length >= 4,
  },
  {
    id: "veteran",
    name: "Veteran",
    icon: "🏆",
    desc: "Logged 30+ hours of playtime.",
    check: (u) => u.playtimeHours >= 30,
  },
  // ADDED — Premium / Coins / Play Time achievements
  {
    id: "go_premium",
    name: "Gone Premium",
    icon: "👑",
    desc: "Activated Pixel&Games Premium.",
    check: (u) => !!u.premium,
  },
  {
    id: "coin_collector",
    name: "Coin Collector",
    icon: "🪙",
    desc: "Earned 200 or more Coins.",
    check: (u) => (u.coins || 0) >= 200,
  },
  {
    id: "first_session",
    name: "First Session",
    icon: "⏱️",
    desc: "Completed a tracked play session.",
    check: (u) => Object.keys(u.gamePlaytime || {}).length >= 1,
  },
];

/* ============================================================
   ADDED — PROFILE BADGES
   Separate from ACHIEVEMENTS (no Coins reward, just a collectible
   profile flair) but reuses the exact same user fields already
   tracked elsewhere (library, premium, playedGameIds, coins, etc).
   ============================================================ */
const BADGES = [
  {
    id: "first_player",
    icon: "🎮",
    nameKey: "badge_first_player_name",
    descKey: "badge_first_player_desc",
    target: 1,
    progress: (u) => Math.min((u.playedGameIds || []).length, 1),
    check: (u) => (u.playedGameIds || []).length >= 1,
  },
  {
    id: "game_explorer",
    icon: "🔥",
    nameKey: "badge_game_explorer_name",
    descKey: "badge_game_explorer_desc",
    target: 5,
    progress: (u) => Math.min((u.playedGameIds || []).length, 5),
    check: (u) => (u.playedGameIds || []).length >= 5,
  },
  {
    id: "mystery_hunter",
    icon: "🎁",
    nameKey: "badge_mystery_hunter_name",
    descKey: "badge_mystery_hunter_desc",
    target: 1,
    progress: (u) => Math.min(u.mysteryBoxesOpened || 0, 1),
    check: (u) => (u.mysteryBoxesOpened || 0) >= 1,
  },
  {
    id: "coin_collector_badge",
    icon: "💰",
    nameKey: "badge_coin_collector_name",
    descKey: "badge_coin_collector_desc",
    target: 1000,
    progress: (u) => Math.min(u.totalCoinsEarned || 0, 1000),
    check: (u) => (u.totalCoinsEarned || 0) >= 1000,
  },
  {
    id: "premium_player",
    icon: "💎",
    nameKey: "badge_premium_player_name",
    descKey: "badge_premium_player_desc",
    target: 1,
    progress: (u) => (u.premium ? 1 : 0),
    check: (u) => !!u.premium,
  },
  {
    id: "game_collector_badge",
    icon: "🏆",
    nameKey: "badge_game_collector_name",
    descKey: "badge_game_collector_desc",
    target: 8,
    progress: (u) =>
      Math.min(
        Math.max((u.playedGameIds || []).length, (u.library || []).length),
        8,
      ),
    check: (u) =>
      Math.max((u.playedGameIds || []).length, (u.library || []).length) >= 8,
  },
];

/* ============================================================
   ADDED — COINS, PREMIUM, DAILY BONUS constants
   ============================================================ */
const COINS_FROM_DAILY_BONUS = 50;
// ADDED — Currency Exchange: central client-side constant, purely for
// display/instant feedback. The server (api/_lib/exchangeConfig.js) is
// the actual authority on the rate — this only has to match it for the
// UI to show correct numbers before submitting.
const COINS_PER_USD = 1000;
const COINS_FROM_PREMIUM = 300;
const COINS_PER_MINUTE_PLAYED = 2;
const COINS_PER_ACHIEVEMENT = 25;
const COINS_FROM_FREE_ADD = 5;
const COINS_PER_DOLLAR_SPENT = 3;

/* ============================================================
   ADDED — RECENTLY PLAYED + MYSTERY BOX constants
   ============================================================ */
const RECENTLY_PLAYED_MAX = 6;
const MYSTERY_BOX_COOLDOWN_MS = 24 * 60 * 60 * 1000;
// Balanced weighted reward table — bigger payouts are rarer.
const MYSTERY_BOX_REWARDS = [
  { amount: 50, weight: 35 },
  { amount: 100, weight: 30 },
  { amount: 250, weight: 20 },
  { amount: 500, weight: 10 },
  { amount: 1000, weight: 5 },
];
const PREMIUM_PRICE = 4.99;
const DAILY_BONUS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MIN_TRACKED_SESSION_MS = 3000; // ignore accidental instant focus bounces

/* ============================================================
   ADDED — GAME CATEGORY FILTER (Store)
   ============================================================ */
let currentStoreCategory = "All";

const TOPUP_PRESETS = [5, 10, 25, 50, 100];
let selectedTopupAmount = 10;

/* ============================================================
   ADDED — FRIENDS SYSTEM: fake player directory (design only,
   100% offline, no backend / no real accounts involved)
   ============================================================ */
const FAKE_PLAYERS = [
  {
    id: "p_shadow",
    nickname: "Shadow",
    avatar: "🥷",
    level: 24,
    favoriteGame: "Static Hollow",
    bio: "Plays best after midnight. Horror games are my comfort zone.",
  },
  {
    id: "p_ghost",
    nickname: "Ghost",
    avatar: "👻",
    level: 31,
    favoriteGame: "Nightloop City",
    bio: "Speedrunning puzzle loops one reset at a time.",
  },
  {
    id: "p_nova",
    nickname: "Nova",
    avatar: "🌟",
    level: 18,
    favoriteGame: "Glasswing",
    bio: "Platformer enthusiast, always chasing a perfect run.",
  },
  {
    id: "p_pixelking",
    nickname: "PixelKing",
    avatar: "👑",
    level: 42,
    favoriteGame: "Ashen Reach",
    bio: "Collector at heart — if it is on the store, it is in my library.",
  },
  {
    id: "p_darkknight",
    nickname: "DarkKnight",
    avatar: "🛡️",
    level: 37,
    favoriteGame: "Ferrous Crown",
    bio: "Strategy is life. I forge empires before breakfast.",
  },
  {
    id: "p_cyberwolf",
    nickname: "CyberWolf",
    avatar: "🐺",
    level: 29,
    favoriteGame: "Copper Verdict",
    bio: "Detective at heart, one clue away from the truth.",
  },
  {
    id: "p_crystal",
    nickname: "Crystal",
    avatar: "💎",
    level: 15,
    favoriteGame: "Glasswing",
    bio: "New to the launcher, always up for a co-op session.",
  },
  {
    id: "p_venom",
    nickname: "Venom",
    avatar: "🐍",
    level: 50,
    favoriteGame: "Static Hollow",
    bio: "Top of the leaderboard. Come find out why.",
  },
  {
    id: "p_hunter",
    nickname: "Hunter",
    avatar: "🏹",
    level: 22,
    favoriteGame: "Ashen Reach",
    bio: "Survival mode only. Every bullet counts.",
  },
  {
    id: "p_dragonx",
    nickname: "DragonX",
    avatar: "🐉",
    level: 44,
    favoriteGame: "Ferrous Crown",
    bio: "Building alliances and burning bridges since day one.",
  },
  {
    id: "p_alpha",
    nickname: "Alpha",
    avatar: "🐺",
    level: 33,
    favoriteGame: "Copper Verdict",
    bio: "First in, last out. Squad leader energy.",
  },
  {
    id: "p_nightfox",
    nickname: "NightFox",
    avatar: "🦊",
    level: 19,
    favoriteGame: "Nightloop City",
    bio: "Clever tricks, cleverer escapes.",
  },
  {
    id: "p_zero",
    nickname: "Zero",
    avatar: "🕳️",
    level: 27,
    favoriteGame: "Static Hollow",
    bio: "Minimalist gamer, maximum focus.",
  },
  {
    id: "p_storm",
    nickname: "Storm",
    avatar: "⛈️",
    level: 36,
    favoriteGame: "Ashen Reach",
    bio: "Fast reflexes, faster comebacks.",
  },
  {
    id: "p_viper",
    nickname: "Viper",
    avatar: "🐍",
    level: 40,
    favoriteGame: "Copper Verdict",
    bio: "Patient, precise, and always three steps ahead.",
  },
  {
    id: "p_reaper",
    nickname: "Reaper",
    avatar: "💀",
    level: 48,
    favoriteGame: "Static Hollow",
    bio: "Horror games do not scare me. I scare them.",
  },
  {
    id: "p_blaze",
    nickname: "Blaze",
    avatar: "🔥",
    level: 21,
    favoriteGame: "Ferrous Crown",
    bio: "Burns through campaigns in record time.",
  },
  {
    id: "p_phantom",
    nickname: "Phantom",
    avatar: "👤",
    level: 34,
    favoriteGame: "Nightloop City",
    bio: "You will not see me coming.",
  },
  {
    id: "p_titan",
    nickname: "Titan",
    avatar: "🗿",
    level: 46,
    favoriteGame: "Ferrous Crown",
    bio: "Slow and unstoppable. Empires fall before me.",
  },
  {
    id: "p_wolf",
    nickname: "Wolf",
    avatar: "🐺",
    level: 25,
    favoriteGame: "Ashen Reach",
    bio: "Runs in packs, plays solo when it counts.",
  },
];
const PLAYER_STATUS_KEY = "pixelgames_player_status";
const PLAYER_STATUSES = ["online", "away", "offline"];

function getPlayerStatuses() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAYER_STATUS_KEY));
    if (saved && typeof saved === "object") return saved;
  } catch (e) {}
  const fresh = {};
  FAKE_PLAYERS.forEach((p, i) => {
    fresh[p.id] = PLAYER_STATUSES[i % PLAYER_STATUSES.length];
  });
  localStorage.setItem(PLAYER_STATUS_KEY, JSON.stringify(fresh));
  return fresh;
}
function getPlayerStatus(id) {
  return getPlayerStatuses()[id] || "offline";
}
function getFakePlayer(id) {
  return FAKE_PLAYERS.find((p) => p.id === id) || null;
}
function gamesOwnedForPlayer(id) {
  // Deterministic "owned games" count so it stays stable across renders.
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) % 97;
  return 1 + (hash % 6);
}

const USERS_KEY = "pixelgames_users";
const SESSION_KEY = "pixelgames_session";
const USER_ID_COUNTER_KEY = "pixelgames_user_id_counter";

/* ============================================================
   ADDED — Telegram Registration Notifications
   ------------------------------------------------------------
   Configuration only. Never put the Bot Token or Chat ID
   anywhere else in this file. The token itself lives on the
   backend (server/.env) — this is just the URL of that backend
   endpoint, which is safe to expose in frontend code.
   Update TELEGRAM_NOTIFY_ENDPOINT to point at your deployed
   backend (see server/README.md for setup instructions).
   ============================================================ */
const TELEGRAM_NOTIFY_CONFIG = {
  // URL of the small backend endpoint (see /server folder) that
  // actually talks to the Telegram Bot API. Leave empty ('') to
  // disable notifications entirely.
  endpoint: "/api/notify-registration",
};

function nextUserId() {
  let n = parseInt(localStorage.getItem(USER_ID_COUNTER_KEY) || "1000", 10);
  if (isNaN(n)) n = 1000;
  n += 1;
  try {
    localStorage.setItem(USER_ID_COUNTER_KEY, String(n));
  } catch (e) {}
  return n;
}

function detectBrowserName() {
  const ua = navigator.userAgent || "";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Unknown";
}

function detectOSName() {
  const ua = navigator.userAgent || "";
  if (/Windows NT 10\.0/.test(ua)) return "Windows 10/11";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}
function formatRegistrationTimestamp(ts) {
  const d = new Date(ts || Date.now());
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function sendTelegramRegistrationNotification(user) {
  console.log("REGISTRATION FUNCTION STARTED", user);
  try {
    console.log("TELEGRAM CONFIG:", TELEGRAM_NOTIFY_CONFIG);

    if (!TELEGRAM_NOTIFY_CONFIG.endpoint) {
      console.log("NO TELEGRAM ENDPOINT");
      return;
    }

    const payload = {
      username: user.nickname || "",
      email: user.gmail || "",
      country: user.country ? countryNameByCode(user.country) : "",
      registeredAt: formatRegistrationTimestamp(user.createdAt),
      userId: user.id != null ? user.id : "",
      browser: detectBrowserName(),
      os: detectOSName(),
      accountType: user.premium ? "Premium" : "Free",
    };

    // Telegram notification
    fetch(TELEGRAM_NOTIFY_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Telegram notification failed:", err);
    });

    // Google Sheets
    fetch(
      "https://script.google.com/macros/s/AKfycbwGhPqhVsBM94TbBK5KDclFzGxW-3sALt_udomHgmXW1EeBvlDoR_OJTB8FyTGfu9Gs/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user",
          username: payload.username,
          email: payload.email,
          country: payload.country,
          city: "Unknown",
          ip: "",
          browser: payload.browser,
          os: payload.os,
          account: payload.accountType,
          date: payload.registeredAt,
          userId: payload.userId,
        }),
      },
    ).catch((err) => {
      console.warn("Google Sheets error:", err);
    });
  } catch (err) {
    console.warn("Telegram notification error:", err);
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  return localStorage.getItem(SESSION_KEY);
}
function setSession(gmail) {
  localStorage.setItem(SESSION_KEY, gmail);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function currentUser() {
  const gmail = getSession();
  if (!gmail) return null;
  const users = getUsers();
  return users[gmail] || null;
}

/* ============================================================
   ADDED — fills in new profile/donate fields for existing
   accounts created before this update, without touching
   anything the account already had.
   ============================================================ */
function ensureUserDefaults(user) {
  let changed = false;
  const defaults = {
    avatarIndex: 0,
    theme: "auto",
    createdAt: Date.now(),
    wishlist: [],
    favorites: [],
    playtimeHours: 0,
    wallet: 0,
    topups: [],
    savedCard: null,
    friends: [],
    friendRequests: ["p_shadow", "p_nova"],
    // ADDED — Premium, Coins, Daily Bonus, Play Time, Purchase Dates
    premium: false,
    premiumSince: null,
    coins: 0,
    lastDailyBonusAt: null,
    gamePlaytime: {},
    purchaseDates: {},
    recentActivity: [],
    unlockedAchievementIds: [],
    // ADDED — custom avatar, bio, country, daily activity log
    customAvatar: null,
    bio: "",
    country: "",
    dailyActivity: {},
    // ADDED — Pixel AI: tracks the previous visit (for "welcome back"
    // messages) and caches the one AI-generated greeting per calendar
    // day so it is never re-requested on every page load.
    lastSeenAt: null,
    aiGreetingCache: null, // { date: "YYYY-MM-DD", text: "..." }
    // ADDED — Recently Played, Mystery Box
    recentlyPlayed: [],
    lastMysteryBoxAt: null,
    // ADDED — Player Statistics, Profile Badges
    playedGameIds: [],
    mysteryBoxesOpened: 0,
    unlockedBadgeIds: [],
    favoriteBadgeId: null,
  };
  Object.keys(defaults).forEach((key) => {
    if (user[key] === undefined) {
      user[key] = defaults[key];
      changed = true;
    }
  });
  // ADDED — lifetime Coins-earned counter for Player Statistics. Seeded
  // from the account's current balance the first time this runs, so an
  // existing account isn't shown "0 Coins Earned" despite already
  // holding Coins; every grant afterwards adds on top via grantCoins().
  if (user.totalCoinsEarned === undefined) {
    user.totalCoinsEarned = user.coins || 0;
    changed = true;
  }
  return changed;
}
function persistCurrentUser(mutatorFn) {
  const gmail = getSession();
  if (!gmail) return null;
  const users = getUsers();
  const u = users[gmail];
  if (!u) return null;
  ensureUserDefaults(u);
  if (mutatorFn) mutatorFn(u);
  saveUsers(users);
  // ADDED — Currency Exchange: keep the server-side "siteCoins" ledger
  // (Sheets, via api/exchange.js) in sync with the local balance every
  // time it changes, so exchange requests validate against a real,
  // last-known-server value instead of trusting the exchange form.
  syncCoinsToServer(u);
  return u;
}

/* ============================================================
   ADDED — shared helper for every Coins grant in the app. Keeps the
   spendable balance (uu.coins) exactly as before, and additionally
   accumulates a lifetime total (uu.totalCoinsEarned) used by the
   Player Statistics "Coins Earned" card — spending/exchanging coins
   only touches uu.coins, never this lifetime counter.
   ============================================================ */
function grantCoins(uu, amount) {
  if (!amount) return;
  uu.coins = (uu.coins || 0) + amount;
  uu.totalCoinsEarned = (uu.totalCoinsEarned || 0) + amount;
}

/* ============================================================
   Validation
   ============================================================ */
function isValidGmail(v) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(v.trim());
}
function isValidPassword(v) {
  return typeof v === "string" && v.length >= 6;
}

/* ============================================================
   Auth UI
   ============================================================ */
function switchTab(which) {
  const isLogin = which === "login";
  document.getElementById("tabLogin").classList.toggle("active", isLogin);
  document.getElementById("tabRegister").classList.toggle("active", !isLogin);
  document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
  document.getElementById("registerForm").classList.toggle("hidden", isLogin);
  document.getElementById("authFoot").innerHTML = isLogin
    ? 'New here? <a href="#" onclick="switchTab(\'register\');return false;" style="color:var(--gold-bright); font-weight:600;">Create an account</a>'
    : 'Already have an account? <a href="#" onclick="switchTab(\'login\');return false;" style="color:var(--gold-bright); font-weight:600;">Sign in</a>';
  hideAuthMsg();
}

function showAuthMsg(text, type) {
  const el = document.getElementById("authMsg");
  el.textContent = text;
  el.className = "auth-msg show " + type;
}
function hideAuthMsg() {
  const el = document.getElementById("authMsg");
  el.className = "auth-msg";
}

function handleRegister(e) {
  e.preventDefault();
  const nickname = document.getElementById("regNickname").value.trim();
  const gmail = document.getElementById("regGmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;

  if (!nickname) {
    showAuthMsg("Nickname is required.", "error");
    return false;
  }
  if (!isValidGmail(gmail)) {
    showAuthMsg("Enter a valid Gmail address (name@gmail.com).", "error");
    return false;
  }
  if (!isValidPassword(password)) {
    showAuthMsg("Password must be at least 6 characters.", "error");
    return false;
  }

  const users = getUsers();
  if (users[gmail]) {
    showAuthMsg("An account with this Gmail already exists.", "error");
    return false;
  }

  users[gmail] = {
    nickname,
    gmail,
    password,
    library: [],
    avatarIndex: 0,
    theme: "auto",
    createdAt: Date.now(),
    wishlist: [],
    favorites: [],
    playtimeHours: 0,
    wallet: 0,
    topups: [],
    savedCard: null,
    friends: [],
    friendRequests: ["p_shadow", "p_nova"],
    // ADDED
    premium: false,
    premiumSince: null,
    coins: 0,
    lastDailyBonusAt: null,
    gamePlaytime: {},
    purchaseDates: {},
    recentActivity: [],
    unlockedAchievementIds: [],
    customAvatar: null,
    bio: "",
    country: "",
    dailyActivity: {},
    // ADDED — Pixel AI
    lastSeenAt: null,
    aiGreetingCache: null,
    // ADDED — Telegram registration notifications
    id: nextUserId(),
  };
  saveUsers(users);
  setSession(gmail);
  recordActivity("logins");
  // ADDED — Telegram registration notifications (non-blocking;
  // registration above is already complete regardless of outcome)
  sendTelegramRegistrationNotification(users[gmail]);
  showAuthMsg("Account created. Welcome in.", "success");
  setTimeout(enterApp, 400);
  return false;
}

function handleLogin(e) {
  e.preventDefault();
  const gmail = document
    .getElementById("loginGmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (!isValidGmail(gmail)) {
    showAuthMsg("Enter a valid Gmail address.", "error");
    return false;
  }
  if (!isValidPassword(password)) {
    showAuthMsg("Password must be at least 6 characters.", "error");
    return false;
  }

  const users = getUsers();
  const user = users[gmail];
  if (!user || user.password !== password) {
    showAuthMsg("Gmail or password is incorrect.", "error");
    return false;
  }
  if (ensureUserDefaults(user)) saveUsers(users);
  setSession(gmail);
  recordActivity("logins");
  enterApp();
  return false;
}

/* ============================================================
   ADDED — ACTIVITY GRAPH tracking helper
   Tracks daily logins, games played, purchases, and library
   additions into user.dailyActivity['YYYY-MM-DD'] = { logins, gamesPlayed, purchases, libraryAdds }
   ============================================================ */
function activityDateKey(d) {
  d = d || new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function recordActivity(type) {
  const gmail = getSession();
  if (!gmail) return;
  persistCurrentUser((u) => {
    u.dailyActivity = u.dailyActivity || {};
    const key = activityDateKey();
    if (!u.dailyActivity[key])
      u.dailyActivity[key] = {
        logins: 0,
        gamesPlayed: 0,
        purchases: 0,
        libraryAdds: 0,
      };
    u.dailyActivity[key][type] = (u.dailyActivity[key][type] || 0) + 1;
  });
}

function logout() {
  clearSession();
  document.getElementById("appShell").classList.add("hidden");
  document.getElementById("authScreen").classList.remove("hidden");
  document.getElementById("loginForm").reset();
  document.getElementById("registerForm").reset();
  switchTab("login");
}

function deleteAccount() {
  const user = currentUser();
  if (!user) return;
  if (
    !confirm(
      "Delete your Pixel&Games account? This removes your library and cannot be undone.",
    )
  )
    return;
  const users = getUsers();
  delete users[user.gmail];
  saveUsers(users);
  clearSession();
  toast("Account deleted.");
  setTimeout(() => {
    document.getElementById("appShell").classList.add("hidden");
    document.getElementById("authScreen").classList.remove("hidden");
    switchTab("login");
  }, 300);
}

/* ============================================================
   ADDED — COINS badge + PREMIUM badges (sidebar + hero pill)
   ============================================================ */
function renderCoinsBadge() {
  const user = currentUser();
  const coins = user ? user.coins || 0 : 0;
  const sideCoinsEl = document.getElementById("sideCoinsValue");
  if (sideCoinsEl) sideCoinsEl.textContent = coins;
  const statCoinsEl = document.getElementById("statCoins");
  if (statCoinsEl) statCoinsEl.textContent = coins;
  const sidePremiumBadge = document.getElementById("sidePremiumBadge");
  if (sidePremiumBadge)
    sidePremiumBadge.classList.toggle("hidden", !(user && user.premium));
  // ADDED — keep the notification dot in sync with recent activity
  const notifDot = document.getElementById("notifDot");
  if (notifDot)
    notifDot.classList.toggle(
      "hidden",
      !(user && user.recentActivity && user.recentActivity.length),
    );
}

/* ============================================================
   ADDED — PREMIUM system
   ============================================================ */
function renderPremiumCard(user) {
  const icon = document.getElementById("premiumCardIcon");
  const status = document.getElementById("premiumCardStatus");
  const price = document.getElementById("premiumCardPrice");
  const btn = document.getElementById("premiumActivateBtn");
  const heroPill = document.getElementById("heroPremiumPill");
  if (!icon || !status || !btn) return;
  if (user.premium) {
    icon.textContent = "👑";
    status.textContent = t("premium_status_active");
    if (price)
      price.textContent = user.premiumSince
        ? `${t("premium_since_label")}: ${new Date(user.premiumSince).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`
        : t("premium_since_label");
    btn.textContent = t("premium_status_active");
    btn.disabled = true;
    btn.classList.add("owned");
  } else {
    icon.textContent = "🔓";
    status.textContent = t("premium_status_free");
    if (price) price.textContent = t("premium_price_label");
    btn.textContent = `${t("premium_activate_btn")} — $${PREMIUM_PRICE.toFixed(2)}`;
    btn.disabled = false;
    btn.classList.remove("owned");
  }
  if (heroPill) heroPill.classList.toggle("hidden", !user.premium);
}

function activatePremium() {
  const user = currentUser();
  if (!user) return;
  if (user.premium) {
    toast("You already have Premium.");
    return;
  }
  if (user.wallet < PREMIUM_PRICE) {
    showInsufficientBalance();
    return;
  }
  const u = persistCurrentUser((uu) => {
    uu.wallet = Math.round((uu.wallet - PREMIUM_PRICE) * 100) / 100;
    uu.premium = true;
    uu.premiumSince = Date.now();
    grantCoins(uu, COINS_FROM_PREMIUM);
  });
  toast("Premium activated! Welcome to Pixel&Games Premium 👑");
  notifyNewAchievements(u);
  renderCoinsBadge();
  renderProfile();
}

/* ============================================================
   ADDED — DAILY BONUS
   ============================================================ */
let dailyBonusInterval = null;

function stopDailyBonusCountdown() {
  if (dailyBonusInterval) {
    clearInterval(dailyBonusInterval);
    dailyBonusInterval = null;
  }
}

function renderDailyBonusCard(user) {
  const btn = document.getElementById("dailyBonusBtn");
  const timerEl = document.getElementById("dailyBonusTimer");
  if (!btn || !timerEl) return;
  stopDailyBonusCountdown();

  function update() {
    const fresh = currentUser();
    if (!fresh) {
      stopDailyBonusCountdown();
      return;
    }
    const last = fresh.lastDailyBonusAt;
    const remaining = last ? last + DAILY_BONUS_COOLDOWN_MS - Date.now() : 0;
    const dailyStatusEl = document.getElementById("dailyRewardStatusVal");
    if (!last || remaining <= 0) {
      btn.disabled = false;
      btn.textContent = t("daily_bonus_claim_btn");
      timerEl.textContent = "";
      if (dailyStatusEl) dailyStatusEl.textContent = t("daily_reward_ready");
    } else {
      btn.disabled = true;
      btn.textContent = t("daily_bonus_claimed_btn");
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      timerEl.textContent = `${t("daily_bonus_next_in")}: ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (dailyStatusEl) dailyStatusEl.textContent = t("daily_reward_waiting");
    }
  }
  update();
  dailyBonusInterval = setInterval(update, 1000);
}

function claimDailyBonus() {
  const user = currentUser();
  if (!user) return;
  const last = user.lastDailyBonusAt;
  const now = Date.now();
  if (last && now - last < DAILY_BONUS_COOLDOWN_MS) {
    toast("Daily bonus not ready yet.");
    return;
  }
  const u = persistCurrentUser((uu) => {
    uu.lastDailyBonusAt = now;
    grantCoins(uu, COINS_FROM_DAILY_BONUS);
  });
  toast(`+${COINS_FROM_DAILY_BONUS} Coins claimed!`);
  notifyNewAchievements(u);
  renderCoinsBadge();
  renderWallet();
}

/* ============================================================
   ADDED — MYSTERY BOX
   One free box per calendar 24h, weighted random Coins reward,
   persisted via the same persistCurrentUser()/Coins system used
   everywhere else (no separate Coins ledger).
   ============================================================ */
let mysteryBoxInterval = null;

function stopMysteryBoxCountdown() {
  if (mysteryBoxInterval) {
    clearInterval(mysteryBoxInterval);
    mysteryBoxInterval = null;
  }
}

function pickMysteryBoxReward() {
  const total = MYSTERY_BOX_REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of MYSTERY_BOX_REWARDS) {
    if (roll < r.weight) return r;
    roll -= r.weight;
  }
  return MYSTERY_BOX_REWARDS[0];
}

function renderMysteryBoxCard() {
  const card = document.getElementById("mysteryBoxCard");
  const btn = document.getElementById("mysteryBoxBtn");
  const artEl = document.getElementById("mysteryBoxArt");
  const statusEl = document.getElementById("mysteryBoxStatus");
  if (!card || !btn) return;
  const user = currentUser();
  if (!user) return;
  ensureUserDefaults(user);
  stopMysteryBoxCountdown();
  card.classList.remove(
    "mystery-box-shaking",
    "mystery-box-reveal",
    "opened",
  );

  const last = user.lastMysteryBoxAt;
  const remaining = last ? last + MYSTERY_BOX_COOLDOWN_MS - Date.now() : 0;

  if (!last || remaining <= 0) {
    if (artEl) artEl.textContent = "🎁";
    btn.disabled = false;
    btn.textContent = t("mystery_box_open_btn");
    if (statusEl) statusEl.innerHTML = "";
  } else {
    card.classList.add("opened");
    if (artEl) artEl.textContent = "🔒";
    btn.disabled = true;
    btn.textContent = t("mystery_box_open_btn");

    function update() {
      const rem = last + MYSTERY_BOX_COOLDOWN_MS - Date.now();
      if (rem <= 0) {
        renderMysteryBoxCard();
        return;
      }
      const h = Math.floor(rem / 3600000);
      const m = Math.floor((rem % 3600000) / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      if (statusEl) {
        statusEl.innerHTML = `<span class="mystery-box-comeback">${t("mystery_box_come_back")}</span><br>${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      }
    }
    update();
    mysteryBoxInterval = setInterval(update, 1000);
  }
}

function openMysteryBox() {
  const user = currentUser();
  if (!user) return;
  const last = user.lastMysteryBoxAt;
  const now = Date.now();
  if (last && now - last < MYSTERY_BOX_COOLDOWN_MS) {
    toast(t("mystery_box_come_back"));
    return;
  }

  const card = document.getElementById("mysteryBoxCard");
  const btn = document.getElementById("mysteryBoxBtn");
  const artEl = document.getElementById("mysteryBoxArt");
  const statusEl = document.getElementById("mysteryBoxStatus");
  if (btn) btn.disabled = true;
  if (card) card.classList.add("mystery-box-shaking");
  if (statusEl) statusEl.innerHTML = "";

  setTimeout(() => {
    const reward = pickMysteryBoxReward();
    const u = persistCurrentUser((uu) => {
      uu.lastMysteryBoxAt = now;
      uu.mysteryBoxesOpened = (uu.mysteryBoxesOpened || 0) + 1;
      grantCoins(uu, reward.amount);
    });
    if (card) {
      card.classList.remove("mystery-box-shaking");
      card.classList.add("mystery-box-reveal");
    }
    if (artEl) artEl.textContent = "✨";
    if (statusEl) {
      statusEl.innerHTML = `<span class="mystery-box-congrats">${t("mystery_box_congrats")}</span><br>${t("mystery_box_you_received")}: +${reward.amount} ${t("stat_coins")}`;
    }
    toast(`${t("mystery_box_congrats")} +${reward.amount} ${t("stat_coins")}`);
    notifyNewAchievements(u);
    renderCoinsBadge();
    setTimeout(() => renderMysteryBoxCard(), 2600);
  }, 900);
}

/* ============================================================
   CURRENCY EXCHANGE (added)
   ------------------------------------------------------------
   Displays the LOCAL balance instantly (same as the rest of the
   site), but every submit re-validates against the server's
   last-synced siteCoins value — see api/exchange.js / Code.gs.
   ============================================================ */

// Identifies the current account to the backend the same way
// findUser/telegram_link already do elsewhere in this codebase —
// prefer the Gmail, fall back to the numeric account id.
function exchangeIdentifier(user) {
  if (!user) return "";
  return user.gmail || (user.id != null ? String(user.id) : "");
}

function syncCoinsToServer(user) {
  const identifier = exchangeIdentifier(user);
  if (!identifier) return;
  fetch("/api/exchange?action=sync-coins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, coins: Math.max(0, Math.floor(user.coins || 0)) }),
  }).catch(() => {
    /* best-effort — a failed sync just means the next mutation retries it */
  });
}

function exEscapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function renderExchange() {
  const user = currentUser();
  if (!user) return;
  const coins = Math.max(0, Math.floor(user.coins || 0));
  const usdAvailable = (coins / COINS_PER_USD).toFixed(2);

  const balanceEl = document.getElementById("exchangeCoinsBalance");
  if (balanceEl) balanceEl.textContent = "🪙 " + coins.toLocaleString();

  const availEl = document.getElementById("exchangeUsdAvailable");
  if (availEl) availEl.textContent = t("exchange_available_label", { amount: "$" + usdAvailable });

  const input = document.getElementById("exchangeCoinsInput");
  if (input) input.value = "";

  updateExchangeCalculation();
  syncCoinsToServer(user);
  loadExchangeHistory(user);
}

function updateExchangeCalculation() {
  const user = currentUser();
  const coins = user ? Math.max(0, Math.floor(user.coins || 0)) : 0;
  const input = document.getElementById("exchangeCoinsInput");
  const btn = document.getElementById("exchangeSubmitBtn");
  const usdOut = document.getElementById("exchangeUsdCalculated");
  const notice = document.getElementById("exchangeMinNotice");
  if (!input) return;

  const raw = input.value.replace(/[^0-9]/g, "");
  if (raw !== input.value) input.value = raw;

  const amount = parseInt(raw || "0", 10);
  const usd = amount > 0 ? amount / COINS_PER_USD : 0;
  if (usdOut) usdOut.textContent = "$" + usd.toFixed(2);

  let valid = Boolean(raw) && amount > 0;
  let msg = "";
  if (valid && amount < COINS_PER_USD) {
    valid = false;
    msg = t("exchange_min_notice");
  } else if (valid && amount > coins) {
    valid = false;
    msg = t("exchange_insufficient_notice");
  }

  if (notice) notice.textContent = msg;
  if (btn) btn.disabled = !valid;
}

async function submitExchange() {
  const user = currentUser();
  if (!user) return;

  const input = document.getElementById("exchangeCoinsInput");
  const methodSel = document.getElementById("exchangePayoutMethod");
  const detailsInput = document.getElementById("exchangePayoutDetails");
  const btn = document.getElementById("exchangeSubmitBtn");

  const amount = parseInt((input && input.value) || "0", 10);
  const coins = Math.max(0, Math.floor(user.coins || 0));
  const paymentMethod = methodSel ? methodSel.value : "";
  const payoutDetails = detailsInput ? detailsInput.value.trim() : "";

  if (!amount || amount < COINS_PER_USD) {
    toast(t("exchange_min_notice"));
    return;
  }
  if (amount > coins) {
    toast(t("exchange_insufficient_notice"));
    return;
  }
  if (!payoutDetails) {
    toast(t("exchange_payout_required"));
    return;
  }

  const identifier = exchangeIdentifier(user);
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/api/exchange?action=create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        coins: amount,
        paymentMethod,
        payoutDetails,
        username: user.nickname || "",
        email: user.gmail || "",
      }),
    });
    const data = await res.json();

    if (!data.ok) {
      const messages = {
        insufficient_coins: t("exchange_insufficient_notice"),
        not_found: t("exchange_not_synced"),
      };
      toast(messages[data.error] || t("exchange_failed"));
      if (btn) btn.disabled = false;
      return;
    }

    // Mirror the server-side deduction locally so the UI stays consistent
    // with the (already-deducted) server balance without a round trip.
    persistCurrentUser((uu) => {
      uu.coins = Math.max(0, (uu.coins || 0) - amount);
    });

    if (detailsInput) detailsInput.value = "";
    toast(t("exchange_submitted"));
    renderCoinsBadge();
    renderExchange();
  } catch (err) {
    toast(t("exchange_failed"));
    if (btn) btn.disabled = false;
  }
}

async function loadExchangeHistory(user) {
  const list = document.getElementById("exchangeHistoryList");
  if (!list) return;
  const identifier = exchangeIdentifier(user);
  if (!identifier) {
    list.innerHTML = `<div class="empty-state">${exEscapeHtml(t("exchange_no_history"))}</div>`;
    return;
  }

  try {
    const res = await fetch("/api/exchange?action=history&identifier=" + encodeURIComponent(identifier));
    const data = await res.json();
    if (!data.ok || !data.requests || !data.requests.length) {
      list.innerHTML = `<div class="empty-state">${exEscapeHtml(t("exchange_no_history"))}</div>`;
      return;
    }
    list.innerHTML = data.requests
      .map((r) => {
        const statusLabel = t("exchange_status_" + r.status) || r.status;
        return `
          <div class="exchange-history-row">
            <div class="exchange-history-date">${exEscapeHtml(String(r.createdAt).slice(0, 16).replace("T", " "))}</div>
            <div class="exchange-history-coins">🪙 ${Number(r.coins).toLocaleString()}</div>
            <div class="exchange-history-usd">$${Number(r.usdAmount).toFixed(2)}</div>
            <div class="exchange-status-pill status-${exEscapeHtml(r.status)}">${exEscapeHtml(statusLabel)}</div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    list.innerHTML = `<div class="empty-state">${exEscapeHtml(t("exchange_history_error"))}</div>`;
  }
}

/* ============================================================
   App shell / views
   ============================================================ */
function enterApp() {
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");
  const user = currentUser();
  if (user) {
    document.getElementById("sideNick").textContent = user.nickname;
    document.getElementById("sideMail").textContent = user.gmail;
    renderAvatarInto("sideAvatarCircle", user);
  }
  syncSiteAccentFromUser();
  renderCoinsBadge();
  if (user) syncCoinsToServer(user);
  restoreActiveSessionIfAny();
  switchView("store");
  // ADDED — Pixel AI: instant, zero-cost "welcome back" insight (plain
  // JS, no API call — see computeVisitInsight), plus at most one real
  // AI-generated personalized greeting per calendar day.
  if (user) pixelAIHandleVisit(user);
}

/* ============================================================
   ADDED — CUSTOM AVATAR rendering helper (shared by sidebar +
   profile hero so both always stay in sync)
   ============================================================ */
function renderAvatarInto(elId, user) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (user.customAvatar) {
    el.innerHTML = `<img src="${user.customAvatar}" alt="Avatar">`;
  } else {
    el.textContent = AVATARS[user.avatarIndex] || AVATARS[0];
  }
}
function handleAvatarUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type || file.type.indexOf("image/") !== 0) {
    toast(t("avatar_invalid_file"));
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    persistCurrentUser((u) => {
      u.customAvatar = dataUrl;
    });
    renderProfile();
    const sideUser = currentUser();
    if (sideUser) renderAvatarInto("sideAvatarCircle", sideUser);
    toast(t("avatar_uploaded"));
  };
  reader.onerror = function () {
    toast(t("avatar_invalid_file"));
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}
function removeCustomAvatar() {
  persistCurrentUser((u) => {
    u.customAvatar = null;
  });
  renderProfile();
  const user = currentUser();
  if (user) renderAvatarInto("sideAvatarCircle", user);
  toast(t("avatar_removed"));
}

function switchView(view) {
  // ADDED — leaving the profile/wallet view stops the daily-bonus countdown interval
  stopDailyBonusCountdown();
  stopMysteryBoxCountdown();
  [
    "store",
    "library",
    "wallet",
    "exchange",
    "profile",
    "friends",
    "partnership",
    "advertisements",
  ].forEach((v) => {
    document.getElementById(v + "View").classList.toggle("hidden", v !== view);
    document
      .getElementById("nav" + v[0].toUpperCase() + v.slice(1))
      .classList.toggle("active", v === view);
  });
  if (view === "store") renderStore();
  if (view === "library") renderLibrary();
  if (view === "wallet") renderWallet();
  if (view === "exchange") renderExchange();
  if (view === "profile") renderProfile();
  if (view === "friends") renderFriendsView();
  if (view === "partnership") renderPartnershipView();
  if (view === "advertisements") renderAdvertisementsView();
  renderCoinsBadge();
}

/* ================= SEARCH SYSTEM (added) =================
   Reusable, instant, case-insensitive search across name/genre/description.
   No page reload — just re-renders the target grid on every keystroke. */

/* Returns true if a game matches the given query string,
   checking title, tag (genre) and blurb (description) — case-insensitive. */
function gameMatchesSearch(game, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    (game.title && game.title.toLowerCase().includes(q)) ||
    (game.tag && game.tag.toLowerCase().includes(q)) ||
    (game.blurb && game.blurb.toLowerCase().includes(q))
  );
}

/* ADDED — short letter mark shown while a game's real cover artwork
   (g.image) hasn't been added yet. E.g. "MARS OUTPOST" -> "MO". */
function gameArtMonogram(title) {
  if (!title) return "?";
  const letters = title
    .trim()
    .split(/\s+/)
    .map((w) => (w.match(/[A-Za-z0-9]/) || [""])[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return letters || "?";
}

/* Reads and normalizes the current value of a search input. */
function readSearchQuery(inputId) {
  const el = document.getElementById(inputId);
  return el ? el.value.trim() : "";
}

/* Shows/hides a search bar's clear (✕) button depending on query state. */
function updateSearchClearBtn(btnId, query) {
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.toggle("visible", !!query);
}

/* Small smooth fade used whenever a grid's contents are re-filtered. */
function fadeGridRefresh(grid, paint) {
  if (!grid) {
    paint();
    return;
  }
  grid.classList.add("search-fading");
  requestAnimationFrame(() => {
    paint();
    requestAnimationFrame(() => {
      grid.classList.remove("search-fading");
    });
  });
}

function onStoreSearchInput() {
  renderStore();
}
function onLibrarySearchInput() {
  renderLibrary();
}

function clearStoreSearch() {
  const el = document.getElementById("storeSearchInput");
  if (el) {
    el.value = "";
    el.focus();
  }
  renderStore();
}
function clearLibrarySearch() {
  const el = document.getElementById("librarySearchInput");
  if (el) {
    el.value = "";
    el.focus();
  }
  renderLibrary();
}

function renderStore() {
  renderGameOfTheDay();
  renderRecentlyPlayed();
  renderStoreCategoryFilters();
  const grid = document.getElementById("storeGrid");
  const user = currentUser();
  const owned = user ? user.library : [];
  const wishlist = user ? user.wishlist : [];
  const favorites = user ? user.favorites : [];

  const query = readSearchQuery("storeSearchInput");
  updateSearchClearBtn("storeSearchClear", query);
  const filteredCatalog = CATALOG.filter(
    (g) =>
      gameMatchesSearch(g, query) &&
      (currentStoreCategory === "All" || g.tag === currentStoreCategory),
  );

  if (filteredCatalog.length === 0) {
    fadeGridRefresh(grid, () => {
      grid.innerHTML = `
        <div class="empty-state search-empty-state" style="grid-column:1/-1;">
          <p>${t("search_no_results_store")}</p>
        </div>`;
    });
    return;
  }

  fadeGridRefresh(grid, () => {
    grid.innerHTML = filteredCatalog
      .map((g) => {
        const priceHtml =
          g.price <= 0
            ? `<span class="price-badge free">FREE</span>`
            : `<span class="price-badge paid">$${g.price.toFixed(2)}</span>`;
        const buyLabel = `${t("btn_buy")} $${g.price.toFixed(2)}`;
        return `
    <div class="card">
      <div class="card-art store-art" style="background:linear-gradient(135deg, ${g.color1}, ${g.color2});">
        <div class="store-art-fallback">
          <span class="store-art-mono">${gameArtMonogram(g.title)}</span>
        </div>
        <img class="store-art-img" src="${g.image}" alt="${g.title}" loading="lazy" decoding="async" onerror="this.style.display='none';" />
        <span class="card-tag">${g.tag}</span>
        <div class="card-icon-row">
          <button class="icon-toggle ${favorites.includes(g.id) ? "on" : ""}" title="Favorite" onclick="toggleFavorite('${g.id}')">★</button>
          <button class="icon-toggle ${wishlist.includes(g.id) ? "on" : ""}" title="Wishlist" onclick="toggleWishlist('${g.id}')">♡</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${g.title}</div>
        <div class="card-line">${g.blurb}</div>
        <div class="price-row">
          ${priceHtml}
        </div>
        <div class="card-actions">
          <button class="btn-sm line" onclick="openDetail('${g.id}')">${t("btn_details")}</button>
          ${
            owned.includes(g.id)
              ? `<button class="btn-sm owned">In Library</button>`
              : g.price > 0
                ? `<button class="btn-sm buy" onclick="addToLibrary('${g.id}')">${buyLabel}</button>`
                : `<button class="btn-sm gold" onclick="addToLibrary('${g.id}')">${t("btn_add")}</button>`
          }
        </div>
      </div>
    </div>
  `;
      })
      .join("");
  });
}

function renderLibrary() {
  const grid = document.getElementById("libraryGrid");
  const user = currentUser();
  const owned = user ? user.library : [];
  const allOwnedGames = CATALOG.filter((g) => owned.includes(g.id));

  if (allOwnedGames.length === 0) {
    // Library truly empty (no games owned at all) — search bar not relevant here.
    updateSearchClearBtn(
      "librarySearchClear",
      readSearchQuery("librarySearchInput"),
    );
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="eyebrow">${t("library_empty_title")}</div>
        <p>${t("library_empty_desc")}</p>
      </div>`;
    return;
  }

  const query = readSearchQuery("librarySearchInput");
  updateSearchClearBtn("librarySearchClear", query);
  const games = allOwnedGames.filter((g) => gameMatchesSearch(g, query));

  if (games.length === 0) {
    fadeGridRefresh(grid, () => {
      grid.innerHTML = `
        <div class="empty-state search-empty-state" style="grid-column:1/-1;">
          <p>${t("search_no_results_library")}</p>
        </div>`;
    });
    return;
  }

  fadeGridRefresh(grid, () => {
    grid.innerHTML = games
      .map((g) => {
        const purchasedAt =
          user && user.purchaseDates ? user.purchaseDates[g.id] : null;
        const seconds =
          user && user.gamePlaytime ? user.gamePlaytime[g.id] || 0 : 0;
        const purchasedHtml = purchasedAt
          ? `<div class="library-purchase-date">${t("library_purchased_on")}: ${new Date(purchasedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}<br>${new Date(purchasedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</div>`
          : "";
        const playtimeHtml = `<div class="library-playtime">${t("library_playtime")}: ${formatDuration(seconds)}</div>`;
        return `
    <div class="card">
      <div class="card-art" style="background:linear-gradient(135deg, ${g.color1}, ${g.color2});">
        <span class="card-tag">${g.tag}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${g.title}</div>
        <div class="card-line">${g.blurb}</div>
        ${playtimeHtml}
        ${purchasedHtml}
        <div class="card-actions">
          <button class="btn-sm play" onclick="playGame('${g.path}','${g.id}')">▶ ${t("btn_play")}</button>
          <button class="btn-sm danger" onclick="removeFromLibrary('${g.id}')">🗑 ${t("btn_remove_game")}</button>
        </div>
      </div>
    </div>
  `;
      })
      .join("");
  });
}

/* ADDED — format seconds as "Xh Ym" (or "Ym" / "0m") */
function formatDuration(totalSeconds) {
  totalSeconds = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/* ============================================================
   ADDED — PLAYER STATISTICS (Profile view)
   Built entirely from data the app already tracks elsewhere
   (gamePlaytime, coins, playedGameIds, mysteryBoxesOpened,
   recentlyPlayed) — no separate/fake stats.
   ============================================================ */
function renderPlayerStatistics() {
  const user = currentUser();
  if (!user) return;
  ensureUserDefaults(user);

  const gamesPlayed = (user.playedGameIds || []).length;
  const totalSeconds = Object.values(user.gamePlaytime || {}).reduce(
    (a, b) => a + b,
    0,
  );
  const coinsEarned = user.totalCoinsEarned || 0;
  const boxesOpened = user.mysteryBoxesOpened || 0;

  const gEl = document.getElementById("pstatGamesPlayed");
  if (gEl) gEl.textContent = gamesPlayed;
  const pEl = document.getElementById("pstatTotalPlaytime");
  if (pEl) pEl.textContent = formatDuration(totalSeconds);
  const cEl = document.getElementById("pstatCoinsEarned");
  if (cEl) cEl.textContent = coinsEarned.toLocaleString();
  const bEl = document.getElementById("pstatMysteryBoxes");
  if (bEl) bEl.textContent = boxesOpened;

  const recentList = document.getElementById("playerStatsRecentList");
  if (recentList) {
    const recentGames = (user.recentlyPlayed || [])
      .map((id) => CATALOG.find((g) => g.id === id))
      .filter(Boolean);
    recentList.innerHTML = recentGames.length
      ? recentGames
          .map(
            (g) => `<span class="player-stats-recent-chip">${g.title}</span>`,
          )
          .join("")
      : `<span class="player-stats-recent-empty">${t("recently_played_empty_title")}</span>`;
  }
}

function renderProfile() {
  const user = currentUser();
  if (!user) return;
  ensureUserDefaults(user);

  // legacy summary card (kept)
  document.getElementById("profNick").textContent = user.nickname;
  document.getElementById("profMail").textContent = user.gmail;
  document.getElementById("profLibCount").textContent =
    user.library.length + " game" + (user.library.length === 1 ? "" : "s");

  // hero
  renderAvatarInto("avatarCircle", user);
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");
  if (removeAvatarBtn)
    removeAvatarBtn.classList.toggle("hidden", !user.customAvatar);
  document.getElementById("heroNick").textContent = user.nickname;
  document.getElementById("heroMail").textContent = user.gmail;

  const { xp, level, xpInLevel } = computeXP(user);
  document.getElementById("avatarLevelBadge").textContent = "LV " + level;
  document.getElementById("xpLevelLabel").textContent = "Level " + level;
  document.getElementById("xpLabel").textContent = `XP ${xpInLevel} / 100`;
  document.getElementById("xpBarFill").style.width = xpInLevel + "%";

  // stat cards
  document.getElementById("statGames").textContent = user.library.length;
  document.getElementById("statHours").textContent = user.playtimeHours;
  document.getElementById("statAch").textContent =
    unlockedAchievements(user).length + "/" + ACHIEVEMENTS.length;
  document.getElementById("statWishlist").textContent = user.wishlist.length;

  const favGame = user.favorites.length
    ? CATALOG.find((g) => g.id === user.favorites[user.favorites.length - 1])
    : null;
  document.getElementById("statFavGame").textContent = favGame
    ? favGame.title
    : "—";
  document.getElementById("statFavCount").textContent = user.favorites.length;
  document.getElementById("statCreated").textContent = formatMemberSince(
    user.createdAt,
  );

  // ADDED — USER BIO
  const heroBioEl = document.getElementById("heroBio");
  const bioTextareaEl = document.getElementById("bioTextarea");
  const bioCounterEl = document.getElementById("bioCounter");
  if (heroBioEl)
    heroBioEl.textContent = user.bio ? user.bio : t("bio_empty_hint");
  if (bioTextareaEl && document.activeElement !== bioTextareaEl)
    bioTextareaEl.value = user.bio || "";
  if (bioCounterEl) {
    const len = (user.bio || "").length;
    bioCounterEl.textContent = len + " / 250";
    bioCounterEl.classList.toggle("limit-near", len >= 230);
  }

  // ADDED — COUNTRY
  populateCountrySelect();
  const countrySelectEl = document.getElementById("countrySelect");
  if (countrySelectEl) countrySelectEl.value = user.country || "";
  const heroCountryEl = document.getElementById("heroCountry");
  if (heroCountryEl) {
    if (user.country) {
      heroCountryEl.innerHTML = `<span class="country-flag">${countryFlagEmoji(user.country)}</span> ${countryNameByCode(user.country)}`;
    } else {
      heroCountryEl.textContent = "";
    }
  }

  // ADDED — ACTIVITY GRAPH
  renderActivityChart(currentActivityRange);

  // ADDED — coins + premium status
  renderCoinsBadge();
  renderPremiumCard(user);

  // ADDED — Player Statistics + Profile Badges
  renderPlayerStatistics();
  renderBadges();

  // ADDED — Play Time summary
  const totalSeconds = Object.values(user.gamePlaytime || {}).reduce(
    (a, b) => a + b,
    0,
  );
  const playtimeTotalEl = document.getElementById("playtimeTotalHours");
  if (playtimeTotalEl)
    playtimeTotalEl.textContent = formatDuration(totalSeconds);

  const dailyStatusEl = document.getElementById("dailyRewardStatusVal");
  if (dailyStatusEl) {
    const last = user.lastDailyBonusAt;
    const ready = !last || Date.now() - last >= DAILY_BONUS_COOLDOWN_MS;
    dailyStatusEl.textContent = ready
      ? t("daily_reward_ready")
      : t("daily_reward_waiting");
  }

  // ADDED — per-game playtime list
  const perGameEl = document.getElementById("perGamePlaytimeList");
  if (perGameEl) {
    const entries = Object.entries(user.gamePlaytime || {}).filter(
      ([, secs]) => secs > 0,
    );
    if (!entries.length) {
      perGameEl.innerHTML = `
        <div class="empty-state">
          <p>${t("recent_activity_empty")}</p>
        </div>`;
    } else {
      perGameEl.innerHTML = entries
        .map(([gameId, secs]) => {
          const g = CATALOG.find((x) => x.id === gameId);
          return `
          <div class="glass-card info-chip">
            <div class="profile-label">${g ? g.title : gameId}</div>
            <div class="profile-val">${formatDuration(secs)}</div>
          </div>`;
        })
        .join("");
    }
  }

  // ADDED — recent activity list
  const activityEl = document.getElementById("recentActivityList");
  if (activityEl) {
    const activity = user.recentActivity || [];
    if (!activity.length) {
      activityEl.innerHTML = `
        <div class="empty-state">
          <p>${t("recent_activity_empty")}</p>
        </div>`;
    } else {
      activityEl.innerHTML = activity
        .map(
          (a) => `
        <div class="history-item">
          <div class="history-icon">🎮</div>
          <div class="history-info">
            <div class="history-amount">${a.title}</div>
            <div class="history-meta">${formatDuration(a.durationSeconds)} — ${new Date(a.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        </div>`,
        )
        .join("");
    }
  }

  // ADDED — purchase history list
  const purchaseEl = document.getElementById("purchaseHistoryList");
  if (purchaseEl) {
    const purchases = Object.entries(user.purchaseDates || {}).sort(
      (a, b) => b[1] - a[1],
    );
    if (!purchases.length) {
      purchaseEl.innerHTML = `
        <div class="empty-state">
          <p>${t("purchase_history_empty")}</p>
        </div>`;
    } else {
      purchaseEl.innerHTML = purchases
        .map(([gameId, date]) => {
          const g = CATALOG.find((x) => x.id === gameId);
          return `
          <div class="history-item">
            <div class="history-icon">🛒</div>
            <div class="history-info">
              <div class="history-amount">${g ? g.title : gameId}</div>
              <div class="history-meta">${new Date(date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>`;
        })
        .join("");
    }
  }

  // achievements grid
  document.getElementById("achievementsGrid").innerHTML = ACHIEVEMENTS.map(
    (a) => {
      const isUnlocked = a.check(user);
      return `
      <div class="glass-card achievement-badge ${isUnlocked ? "" : "locked"}">
        <div class="ab-icon">${a.icon}</div>
        <div class="ab-name">${a.name}</div>
        <div class="ab-desc">${a.desc}</div>
      </div>`;
    },
  ).join("");

  // settings
  document.getElementById("settingsNickname").value = user.nickname;
  document.getElementById("avatarPicker").innerHTML = AVATARS.map(
    (emo, i) => `
    <button class="avatar-pick ${i === user.avatarIndex ? "active" : ""}" style="background:var(--surface);" onclick="pickAvatar(${i})">${emo}</button>
  `,
  ).join("");
  document.querySelectorAll("#themeSwatches .theme-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.t === user.theme);
  });
  document.getElementById("profileView").className = "theme-" + user.theme;
}

/* ============================================================
   ADDED — profile settings actions (auto-save to LocalStorage)
   ============================================================ */
function flashSavedHint() {
  const el = document.getElementById("settingsSavedHint");
  el.classList.add("show");
  clearTimeout(flashSavedHint._t);
  flashSavedHint._t = setTimeout(() => el.classList.remove("show"), 1400);
}
function saveSettingsNickname() {
  const val = document.getElementById("settingsNickname").value.trim();
  if (!val) return;
  persistCurrentUser((u) => {
    u.nickname = val;
  });
  document.getElementById("sideNick").textContent = val;
  document.getElementById("heroNick").textContent = val;
  document.getElementById("profNick").textContent = val;
  flashSavedHint();
}
function pickAvatar(i) {
  persistCurrentUser((u) => {
    u.avatarIndex = i;
  });
  renderProfile();
  flashSavedHint();
}
function changeAvatar() {
  const user = currentUser();
  if (!user) return;
  const next = (user.avatarIndex + 1) % AVATARS.length;
  persistCurrentUser((u) => {
    u.avatarIndex = next;
  });
  renderProfile();
}
function setTheme(t) {
  persistCurrentUser((u) => {
    u.theme = t;
  });
  applySiteAccent(t);
  renderProfile();
  flashSavedHint();
}

/* ============================================================
   ADDED — USER BIO actions
   ============================================================ */
function onBioInput() {
  const el = document.getElementById("bioTextarea");
  if (!el) return;
  const val = el.value.slice(0, 250);
  persistCurrentUser((u) => {
    u.bio = val;
  });
  const heroBioEl = document.getElementById("heroBio");
  if (heroBioEl) heroBioEl.textContent = val ? val : t("bio_empty_hint");
  const counterEl = document.getElementById("bioCounter");
  if (counterEl) {
    counterEl.textContent = val.length + " / 250";
    counterEl.classList.toggle("limit-near", val.length >= 230);
  }
  el.classList.toggle("limit-near", val.length >= 230);
  flashSavedHint();
}
function focusBioEditor() {
  const el = document.getElementById("bioTextarea");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus();
}

/* ============================================================
   ADDED — COUNTRY actions
   ============================================================ */
function saveCountry() {
  const sel = document.getElementById("countrySelect");
  if (!sel) return;
  const code = sel.value;
  persistCurrentUser((u) => {
    u.country = code;
  });
  renderProfile();
  flashSavedHint();
}

/* ============================================================
   ADDED — ACTIVITY GRAPH rendering
   ============================================================ */
let currentActivityRange = 7;
function setActivityRange(range) {
  currentActivityRange = range;
  const btn7 = document.getElementById("activityRangeBtn7");
  const btn30 = document.getElementById("activityRangeBtn30");
  if (btn7) btn7.classList.toggle("active", range === 7);
  if (btn30) btn30.classList.toggle("active", range === 30);
  renderActivityChart(range);
}
function renderActivityChart(range) {
  const container = document.getElementById("activityChart");
  if (!container) return;
  const user = currentUser();
  if (!user) return;
  const activity = user.dailyActivity || {};

  const days = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = activityDateKey(d);
    days.push({
      key,
      date: d,
      data: activity[key] || {
        logins: 0,
        gamesPlayed: 0,
        purchases: 0,
        libraryAdds: 0,
      },
    });
  }

  const hasAny = days.some(
    (d) =>
      d.data.logins ||
      d.data.gamesPlayed ||
      d.data.purchases ||
      d.data.libraryAdds,
  );
  container.classList.toggle("range-30", range === 30);

  if (!hasAny) {
    container.innerHTML = `<div class="activity-chart-empty">${t("activity_empty")}</div>`;
    return;
  }

  let maxVal = 1;
  days.forEach((d) => {
    maxVal = Math.max(
      maxVal,
      d.data.logins || 0,
      d.data.gamesPlayed || 0,
      d.data.purchases || 0,
      d.data.libraryAdds || 0,
    );
  });

  const labelEvery = range === 30 ? 5 : 1;
  const lang = getCurrentLanguage();
  const localeMap = { en: "en-US", ru: "ru-RU", uz: "en-GB" };

  container.innerHTML = days
    .map((d, i) => {
      const showLabel = i % labelEvery === 0 || i === days.length - 1;
      const label = showLabel
        ? d.date.toLocaleDateString(localeMap[lang] || "en-US", {
            day: "numeric",
            month: "short",
          })
        : "";
      const dateTitle = d.date.toLocaleDateString(localeMap[lang] || "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `
      <div class="activity-col" title="${dateTitle}">
        <div class="activity-bars" data-key="${d.key}">
          <div class="activity-bar bar-logins" data-h="${Math.round((d.data.logins / maxVal) * 100)}" title="${t("activity_legend_logins")}: ${d.data.logins}"></div>
          <div class="activity-bar bar-games" data-h="${Math.round((d.data.gamesPlayed / maxVal) * 100)}" title="${t("activity_legend_games")}: ${d.data.gamesPlayed}"></div>
          <div class="activity-bar bar-purchases" data-h="${Math.round((d.data.purchases / maxVal) * 100)}" title="${t("activity_legend_purchases")}: ${d.data.purchases}"></div>
          <div class="activity-bar bar-library" data-h="${Math.round((d.data.libraryAdds / maxVal) * 100)}" title="${t("activity_legend_library")}: ${d.data.libraryAdds}"></div>
        </div>
        <div class="activity-col-label">${label}</div>
      </div>`;
    })
    .join("");

  // ADDED — animate bars in smoothly after the DOM has painted at height 0
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll(".activity-bar").forEach((bar) => {
        const h = parseFloat(bar.dataset.h) || 0;
        bar.style.height = Math.max(2, h) + "%";
      });
    });
  });
}

/* ============================================================
   Store actions
   ============================================================ */
function addToLibrary(id) {
  const g = CATALOG.find((x) => x.id === id);
  const user = currentUser();
  if (!user || !g) return;
  if (user.library.includes(id)) return;

  const finalPrice = g.price;

  if (finalPrice > 0 && user.wallet < finalPrice) {
    showInsufficientBalance();
    return;
  }

  const u = persistCurrentUser((uu) => {
    if (finalPrice > 0)
      uu.wallet = Math.round((uu.wallet - finalPrice) * 100) / 100;
    uu.library.push(id);
    uu.playtimeHours =
      Math.round((uu.playtimeHours + (3 + Math.random() * 15)) * 10) / 10;
    // ADDED — purchase date/time + coins reward
    uu.purchaseDates = uu.purchaseDates || {};
    uu.purchaseDates[id] = Date.now();
    grantCoins(
      uu,
      finalPrice > 0
        ? Math.round(finalPrice * COINS_PER_DOLLAR_SPENT)
        : COINS_FROM_FREE_ADD,
    );
  });
  toast(
    finalPrice > 0
      ? `Purchased ${g.title} for $${finalPrice.toFixed(2)}.`
      : "Added to your library.",
  );
  notifyNewAchievements(u);
  recordActivity("libraryAdds");
  if (finalPrice > 0) recordActivity("purchases");
  renderCoinsBadge();
  renderStore();
}

/* ============================================================
   ADDED — remove a game from the library (does not affect the
   Store catalog, wishlist, or favorites)
   ============================================================ */
function removeFromLibrary(id) {
  const g = CATALOG.find((x) => x.id === id);
  const user = currentUser();
  if (!user || !g) return;
  if (!user.library.includes(id)) return;

  if (!confirm("Are you sure you want to remove this game from your library?"))
    return;

  persistCurrentUser((uu) => {
    uu.library = uu.library.filter((gameId) => gameId !== id);
  });

  toast("Game removed from your library.");
  renderLibrary();
  renderStore();
  renderProfile();
}

/* ============================================================
   ADDED — insufficient balance prompt
   ============================================================ */
function showInsufficientBalance() {
  document.getElementById("modalMount").innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="modal-body thanks-modal">
          <div class="thanks-icon" style="background:linear-gradient(135deg, var(--danger), #8a3a2f);">⚠</div>
          <div class="thanks-title">Insufficient Balance</div>
          <div class="thanks-desc">Your wallet doesn't have enough funds for this game. Top up to continue.</div>
          <div class="modal-actions">
            <button class="btn-sm gold" style="flex:1;" onclick="closeModal(); switchView('wallet');">Open Wallet</button>
            <button class="btn-sm line" style="flex:1;" onclick="closeModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   ADDED — wishlist / favorites toggles
   ============================================================ */
function toggleWishlist(id) {
  const u = persistCurrentUser((u) => {
    const i = u.wishlist.indexOf(id);
    if (i === -1) u.wishlist.push(id);
    else u.wishlist.splice(i, 1);
  });
  if (u) notifyNewAchievements(u);
  renderStore();
}
function toggleFavorite(id) {
  const u = persistCurrentUser((u) => {
    const i = u.favorites.indexOf(id);
    if (i === -1) u.favorites.push(id);
    else u.favorites.splice(i, 1);
  });
  if (u) notifyNewAchievements(u);
  renderStore();
}

/* ============================================================
   ADDED — achievements engine
   ============================================================ */
function unlockedAchievements(u) {
  return ACHIEVEMENTS.filter((a) => a.check(u));
}
function notifyNewAchievements(u) {
  if (!u) return;
  checkNewBadges(u);
  const unlocked = unlockedAchievements(u).map((a) => a.id);
  const prev = u.unlockedAchievementIds || [];
  const fresh = unlocked.filter((id) => !prev.includes(id));
  if (fresh.length) {
    const a = ACHIEVEMENTS.find((x) => x.id === fresh[0]);
    toast(`Achievement unlocked: ${a.icon} ${a.name}`);
    // ADDED — Coins reward per newly unlocked achievement (persisted so a
    // page reload can never re-grant coins for achievements already earned)
    const reward = fresh.length * COINS_PER_ACHIEVEMENT;
    persistCurrentUser((uu) => {
      grantCoins(uu, reward);
      uu.unlockedAchievementIds = unlocked;
    });
    renderCoinsBadge();
  } else if (prev.length !== unlocked.length) {
    persistCurrentUser((uu) => {
      uu.unlockedAchievementIds = unlocked;
    });
  }
}

/* ============================================================
   ADDED — PROFILE BADGES (unlock check, render, favorite pick)
   ============================================================ */
function checkNewBadges(u) {
  if (!u) return;
  const unlockedIds = BADGES.filter((b) => b.check(u)).map((b) => b.id);
  const prev = u.unlockedBadgeIds || [];
  const fresh = unlockedIds.filter((id) => !prev.includes(id));
  if (fresh.length || prev.length !== unlockedIds.length) {
    persistCurrentUser((uu) => {
      uu.unlockedBadgeIds = unlockedIds;
    });
  }
  fresh.forEach((id) => {
    const b = BADGES.find((x) => x.id === id);
    if (b) toast(`${t("badge_unlocked_toast")}: ${b.icon} ${t(b.nameKey)}`);
  });
  const profileView = document.getElementById("profileView");
  if (profileView && !profileView.classList.contains("hidden")) {
    renderBadges();
  }
}

function renderBadges() {
  const grid = document.getElementById("badgesGrid");
  const user = currentUser();
  if (!grid || !user) return;
  const unlocked = user.unlockedBadgeIds || [];

  grid.innerHTML = BADGES.map((b) => {
    const isUnlocked = unlocked.includes(b.id);
    const isFavorite = user.favoriteBadgeId === b.id;
    const progressHtml =
      b.target > 1
        ? `
        <div class="badge-progress-track"><div class="badge-progress-fill" style="width:${(b.progress(user) / b.target) * 100}%"></div></div>
        <div class="badge-progress-label">${b.progress(user).toLocaleString()} / ${b.target.toLocaleString()}</div>`
        : "";
    return `
    <div class="badge-card ${isUnlocked ? "unlocked" : "locked"}${isFavorite ? " favorite" : ""}"
         ${isUnlocked ? `onclick="selectFavoriteBadge('${b.id}')" title="${t("badge_select_favorite_hint")}"` : ""}>
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${t(b.nameKey)}</div>
      <div class="badge-desc">${t(b.descKey)}</div>
      ${progressHtml}
      <div class="badge-state">${isUnlocked ? t("badge_state_unlocked") : t("badge_state_locked")}</div>
    </div>
  `;
  }).join("");

  const pill = document.getElementById("heroFavoriteBadgePill");
  if (pill) {
    const favBadge = user.favoriteBadgeId
      ? BADGES.find((b) => b.id === user.favoriteBadgeId)
      : null;
    if (favBadge && unlocked.includes(favBadge.id)) {
      pill.textContent = `${favBadge.icon} ${t(favBadge.nameKey)}`;
      pill.classList.remove("hidden");
    } else {
      pill.classList.add("hidden");
    }
  }
}

function selectFavoriteBadge(id) {
  const user = currentUser();
  if (!user) return;
  const unlocked = user.unlockedBadgeIds || [];
  if (!unlocked.includes(id)) return;
  persistCurrentUser((uu) => {
    uu.favoriteBadgeId = uu.favoriteBadgeId === id ? null : id;
  });
  renderBadges();
}
function computeXP(u) {
  const xp =
    u.library.length * 20 +
    u.topups.length * 15 +
    u.favorites.length * 10 +
    unlockedAchievements(u).length * 25 +
    u.wishlist.length * 5;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  return { xp, level, xpInLevel };
}

/* ============================================================
   ADDED — FRIENDS SYSTEM (frontend simulation, LocalStorage only)
   ============================================================ */
function statusLabel(status) {
  return status === "online"
    ? "Online"
    : status === "away"
      ? "Away"
      : "Offline";
}

function renderFriendsView() {
  const user = currentUser();
  if (!user) return;
  ensureUserDefaults(user);

  const statuses = getPlayerStatuses();
  const onlineCount = user.friends.filter(
    (id) => statuses[id] === "online",
  ).length;

  document.getElementById("friendStatTotal").textContent = user.friends.length;
  document.getElementById("friendStatOnline").textContent = onlineCount;
  document.getElementById("friendStatPending").textContent =
    user.friendRequests.length;

  renderFriendRequests(user);
  renderMyFriends(user);
  renderPlayerDirectory();
}

function renderFriendRequests(user) {
  user = user || currentUser();
  if (!user) return;
  const el = document.getElementById("friendRequestsList");
  if (!user.friendRequests.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="eyebrow">No Pending Requests</div>
        <p>You're all caught up. New friend requests will show up here.</p>
      </div>`;
    return;
  }
  el.innerHTML = user.friendRequests
    .map((id) => {
      const p = getFakePlayer(id);
      if (!p) return "";
      return `
      <div class="glass-card request-card">
        <div class="friend-avatar" style="width:44px;height:44px;font-size:20px;">${p.avatar}</div>
        <div class="request-info">
          <div class="request-name">${p.nickname} wants to be your friend.</div>
          <div class="request-sub">Level ${p.level} · Favorite: ${p.favoriteGame}</div>
        </div>
        <div class="request-actions">
          <button class="btn-sm gold" onclick="acceptFriendRequest('${id}')">Accept</button>
          <button class="btn-sm line" onclick="declineFriendRequest('${id}')">Decline</button>
        </div>
      </div>`;
    })
    .join("");
}

function renderMyFriends(user) {
  user = user || currentUser();
  if (!user) return;
  const el = document.getElementById("myFriendsGrid");
  if (!user.friends.length) {
    el.innerHTML = `
      <div class="empty-state friends-empty">
        <div class="eyebrow">No Friends Yet</div>
        <p>Search for players below and add them to start building your friends list.</p>
      </div>`;
    return;
  }
  const statuses = getPlayerStatuses();
  el.innerHTML = user.friends
    .map((id) => {
      const p = getFakePlayer(id);
      if (!p) return "";
      const status = statuses[id] || "offline";
      return `
      <div class="glass-card friend-card">
        <div class="friend-card-top">
          <div class="friend-avatar">${p.avatar}<span class="status-dot ${status}"></span></div>
          <div>
            <div class="friend-name">${p.nickname}</div>
            <div class="friend-meta">Level ${p.level}</div>
          </div>
        </div>
        <div class="friend-status-label ${status}">${statusLabel(status)}</div>
        <div class="friend-fav-game">Favorite: ${p.favoriteGame}</div>
        <div class="friend-card-actions">
          <button class="btn-sm gold" onclick="inviteToPlay('${id}')">Invite</button>
          <button class="btn-sm line" onclick="viewPlayerProfile('${id}')">Profile</button>
          <button class="btn-sm danger" onclick="removeFriend('${id}')">Remove</button>
        </div>
      </div>`;
    })
    .join("");
}

function renderPlayerDirectory() {
  const user = currentUser();
  if (!user) return;
  const el = document.getElementById("playerDirectoryGrid");
  const query = (document.getElementById("playerSearchInput").value || "")
    .trim()
    .toLowerCase();

  const list = FAKE_PLAYERS.filter((p) =>
    p.nickname.toLowerCase().includes(query),
  );

  if (!list.length) {
    el.innerHTML = `
      <div class="empty-state friends-empty">
        <div class="eyebrow">No Players Found</div>
        <p>Try a different nickname.</p>
      </div>`;
    return;
  }

  const statuses = getPlayerStatuses();
  el.innerHTML = list
    .map((p) => {
      const status = statuses[p.id] || "offline";
      const isFriend = user.friends.includes(p.id);
      const isPending = user.friendRequests.includes(p.id);
      let actionBtn;
      if (isFriend) {
        actionBtn = `<button class="btn-sm owned" style="flex:1;" disabled>Already Friends</button>`;
      } else if (isPending) {
        actionBtn = `<button class="btn-sm line" style="flex:1;" disabled>Request Pending</button>`;
      } else {
        actionBtn = `<button class="btn-sm gold" style="flex:1;" onclick="addFriend('${p.id}')">Add Friend</button>`;
      }
      return `
      <div class="glass-card player-card">
        <div class="friend-card-top">
          <div class="friend-avatar">${p.avatar}<span class="status-dot ${status}"></span></div>
          <div>
            <div class="friend-name">${p.nickname}</div>
            <div class="friend-meta">Level ${p.level}</div>
          </div>
        </div>
        <div class="friend-status-label ${status}">${statusLabel(status)}</div>
        <div class="player-bio">${p.bio}</div>
        <div class="friend-card-actions">
          ${actionBtn}
          <button class="btn-sm line" style="flex:1;" onclick="viewPlayerProfile('${p.id}')">View Profile</button>
        </div>
      </div>`;
    })
    .join("");
}

function addFriend(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  const user = currentUser();
  if (!user) return;
  if (user.friends.includes(id)) return; // no duplicates
  persistCurrentUser((u) => {
    if (!u.friends.includes(id)) u.friends.push(id);
  });
  toast(`${p.nickname} added to your friends.`);
  renderFriendsView();
}

function removeFriend(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  if (!confirm(`Remove ${p.nickname} from your friends?`)) return;
  persistCurrentUser((u) => {
    u.friends = u.friends.filter((fid) => fid !== id);
  });
  toast(`${p.nickname} removed from your friends.`);
  renderFriendsView();
}

function acceptFriendRequest(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  persistCurrentUser((u) => {
    u.friendRequests = u.friendRequests.filter((rid) => rid !== id);
    if (!u.friends.includes(id)) u.friends.push(id);
  });
  toast(`You and ${p.nickname} are now friends!`);
  renderFriendsView();
}

function declineFriendRequest(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  persistCurrentUser((u) => {
    u.friendRequests = u.friendRequests.filter((rid) => rid !== id);
  });
  toast(`Declined ${p.nickname}'s friend request.`);
  renderFriendsView();
}

function inviteToPlay(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  toast(`Invitation sent to ${p.nickname}!`);
}

function viewPlayerProfile(id) {
  const p = getFakePlayer(id);
  if (!p) return;
  const user = currentUser();
  const status = getPlayerStatus(id);
  const isFriend = user && user.friends.includes(id);
  document.getElementById("modalMount").innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="modal-body thanks-modal" style="text-align:left; padding:26px 24px;">
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
            <div class="friend-avatar" style="width:64px;height:64px;font-size:30px;">${p.avatar}<span class="status-dot ${status}"></span></div>
            <div>
              <div class="modal-title" style="margin-bottom:2px;">${p.nickname}</div>
              <div class="friend-status-label ${status}">${statusLabel(status)}</div>
            </div>
          </div>
          <div class="profile-row"><span class="profile-label">Level</span><span class="profile-val">${p.level}</span></div>
          <div class="profile-row"><span class="profile-label">Favorite Game</span><span class="profile-val">${p.favoriteGame}</span></div>
          <div class="profile-row"><span class="profile-label">Games Owned</span><span class="profile-val">${gamesOwnedForPlayer(p.id)}</span></div>
          <div class="modal-desc" style="margin-top:14px; margin-bottom:8px;">${p.bio}</div>
          <div class="modal-actions">
            ${
              isFriend
                ? `<button class="btn-sm gold" style="flex:1;" onclick="inviteToPlay('${p.id}'); closeModal();">Invite to Play</button>`
                : `<button class="btn-sm gold" style="flex:1;" onclick="addFriend('${p.id}'); closeModal();">Add Friend</button>`
            }
            <button class="btn-sm line" style="flex:1;" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>`;
}

function openDetail(id) {
  const g = CATALOG.find((x) => x.id === id);
  if (!g) return;
  const user = currentUser();
  const owned = user && user.library.includes(id);
  const finalPrice = g.price;
  document.getElementById("modalMount").innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="modal-art" style="background:linear-gradient(135deg, ${g.color1}, ${g.color2});">
          <button class="btn-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="eyebrow" style="margin-bottom:6px;">${g.tag} · ${g.price > 0 ? "$" + g.price.toFixed(2) : "Free"}</div>
          <div class="modal-title">${g.title}</div>
          <div class="modal-desc">${g.blurb}</div>
          <div class="modal-actions">
            ${
              owned
                ? `<button class="btn-sm play" style="flex:1;" onclick="playGame('${g.path}','${g.id}'); closeModal();">▶ Play Now</button>`
                : g.price > 0
                  ? `<button class="btn-sm buy" style="flex:1;" onclick="addToLibrary('${g.id}'); closeModal();">Buy $${finalPrice.toFixed(2)}</button>`
                  : `<button class="btn-sm gold" style="flex:1;" onclick="addToLibrary('${g.id}'); closeModal();">Add to Library</button>`
            }
            <button class="btn-sm line" style="flex:1;" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function closeModal() {
  document.getElementById("modalMount").innerHTML = "";
}

/* ============================================================
   ADDED — PLAY TIME TRACKING
   A session starts the moment Play is pressed. Because the game
   opens in a new tab/window, we detect "closing" the game by
   listening for the launcher window regaining focus.
   ============================================================ */
const ACTIVE_SESSION_KEY = "pixelgames_active_session";
let activeSession = null;

function playGame(path, gameId) {
  window.open(path, "_blank");
  startPlaySession(gameId);
  addToRecentlyPlayed(gameId);
}

/* ============================================================
   ADDED — RECENTLY PLAYED
   Tracks the last RECENTLY_PLAYED_MAX unique games launched via
   playGame(), most-recent first, persisted on the user record the
   same way the rest of the app persists user data.
   ============================================================ */
function addToRecentlyPlayed(gameId) {
  if (!gameId) return;
  const user = currentUser();
  if (!user) return;
  const u = persistCurrentUser((uu) => {
    uu.recentlyPlayed = (uu.recentlyPlayed || []).filter(
      (id) => id !== gameId,
    );
    uu.recentlyPlayed.unshift(gameId);
    uu.recentlyPlayed = uu.recentlyPlayed.slice(0, RECENTLY_PLAYED_MAX);
    // ADDED — lifetime (uncapped) distinct-games-played list, used by
    // Player Statistics and the Game Explorer / Collector badges.
    uu.playedGameIds = uu.playedGameIds || [];
    if (!uu.playedGameIds.includes(gameId)) uu.playedGameIds.push(gameId);
  });
  checkNewBadges(u);
  const storeView = document.getElementById("storeView");
  if (storeView && !storeView.classList.contains("hidden")) {
    renderRecentlyPlayed();
  }
}

function renderRecentlyPlayed() {
  const grid = document.getElementById("recentlyPlayedGrid");
  if (!grid) return;
  const user = currentUser();
  const ids = user && user.recentlyPlayed ? user.recentlyPlayed : [];
  const games = ids
    .map((id) => CATALOG.find((g) => g.id === id))
    .filter(Boolean);

  if (games.length === 0) {
    grid.innerHTML = `
      <div class="empty-state recently-played-empty" style="grid-column:1/-1;">
        <div class="eyebrow">${t("recently_played_empty_title")}</div>
        <p>${t("recently_played_empty_desc")}</p>
      </div>`;
    return;
  }

  grid.innerHTML = games
    .map(
      (g) => `
    <div class="card recently-played-card">
      <div class="card-art store-art" style="background:linear-gradient(135deg, ${g.color1}, ${g.color2});">
        <div class="store-art-fallback">
          <span class="store-art-mono">${gameArtMonogram(g.title)}</span>
        </div>
        <img class="store-art-img" src="${g.image}" alt="${g.title}" loading="lazy" decoding="async" onerror="this.style.display='none';" />
        <span class="card-tag">${g.tag}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${g.title}</div>
        <div class="card-line">${g.blurb}</div>
        <div class="card-actions">
          <button class="btn-sm play" onclick="playGame('${g.path}','${g.id}')">▶ ${t("btn_play_again")}</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ============================================================
   ADDED — GAME OF THE DAY
   Deterministic date-based pick from the existing CATALOG only —
   the same game stays selected all day (local calendar date) and
   automatically rotates to the next one at local midnight.
   ============================================================ */
function getGameOfTheDay() {
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  const index =
    ((daysSinceEpoch % CATALOG.length) + CATALOG.length) % CATALOG.length;
  return CATALOG[index];
}

function renderGameOfTheDay() {
  const wrap = document.getElementById("gameOfTheDayCard");
  if (!wrap) return;
  const g = getGameOfTheDay();
  const user = currentUser();
  const owned = user ? user.library.includes(g.id) : false;

  const priceHtml =
    g.price <= 0
      ? `<span class="price-badge free">FREE</span>`
      : `<span class="price-badge paid">$${g.price.toFixed(2)}</span>`;
  const actionHtml = owned
    ? `<button class="btn-sm play gotd-action" onclick="playGame('${g.path}','${g.id}')">▶ ${t("btn_play")}</button>`
    : g.price > 0
      ? `<button class="btn-sm buy gotd-action" onclick="addToLibrary('${g.id}')">${t("btn_buy")} $${g.price.toFixed(2)}</button>`
      : `<button class="btn-sm gold gotd-action" onclick="addToLibrary('${g.id}')">${t("btn_add")}</button>`;

  wrap.innerHTML = `
    <div class="gotd-media" style="background:linear-gradient(135deg, ${g.color1}, ${g.color2});">
      <img class="gotd-img" src="${g.image}" alt="${g.title}" loading="lazy" decoding="async" onerror="this.style.display='none';">
      <div class="gotd-scrim"></div>
      <div class="gotd-kicker">✦ ${t("game_of_the_day_title")}</div>
    </div>
    <div class="gotd-body">
      <div class="gotd-tag">${g.tag}</div>
      <div class="gotd-title">${g.title}</div>
      <div class="gotd-blurb">${g.blurb}</div>
      <div class="gotd-actions">
        ${priceHtml}
        <button class="btn-sm line gotd-action" onclick="openDetail('${g.id}')">${t("btn_details")}</button>
        ${actionHtml}
      </div>
    </div>
  `;
}

/* ============================================================
   ADDED — GAME CATEGORIES / FILTERS (Store)
   Categories come only from tags already present on real catalog
   entries — nothing invented.
   ============================================================ */
function getStoreCategories() {
  const tags = Array.from(new Set(CATALOG.map((g) => g.tag))).sort();
  return ["All", ...tags];
}

function renderStoreCategoryFilters() {
  const wrap = document.getElementById("storeCategoryFilters");
  if (!wrap) return;
  const categories = getStoreCategories();
  if (!categories.includes(currentStoreCategory)) currentStoreCategory = "All";
  wrap.innerHTML = categories
    .map((c) => {
      const label = c === "All" ? t("category_all") : c;
      const safe = c.replace(/'/g, "\\'");
      return `<button type="button" class="category-chip${c === currentStoreCategory ? " active" : ""}" onclick="selectStoreCategory('${safe}')">${label}</button>`;
    })
    .join("");
}

function selectStoreCategory(cat) {
  currentStoreCategory = cat;
  renderStore();
}

function startPlaySession(gameId) {
  const user = currentUser();
  if (!user || !gameId) return;
  activeSession = { gameId, gmail: user.gmail, start: Date.now() };
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
  } catch (e) {}
}

function restoreActiveSessionIfAny() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY));
    const user = currentUser();
    if (saved && user && saved.gmail === user.gmail) {
      activeSession = saved;
    } else if (saved) {
      // belongs to a different / logged-out account — discard
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (e) {}
}

function stopPlaySessionIfActive() {
  if (!activeSession) return;
  const user = currentUser();
  if (!user || user.gmail !== activeSession.gmail) {
    return;
  }
  const elapsedMs = Date.now() - activeSession.start;
  const gameId = activeSession.gameId;
  activeSession = null;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {}
  if (elapsedMs < MIN_TRACKED_SESSION_MS) return;

  const elapsedSeconds = elapsedMs / 1000;
  const g = CATALOG.find((x) => x.id === gameId);
  const coinsEarned = Math.max(
    1,
    Math.floor((elapsedSeconds / 60) * COINS_PER_MINUTE_PLAYED),
  );

  const u = persistCurrentUser((uu) => {
    uu.gamePlaytime = uu.gamePlaytime || {};
    uu.gamePlaytime[gameId] = (uu.gamePlaytime[gameId] || 0) + elapsedSeconds;
    uu.playtimeHours =
      Math.round(((uu.playtimeHours || 0) + elapsedSeconds / 3600) * 100) / 100;
    grantCoins(uu, coinsEarned);
    uu.recentActivity = uu.recentActivity || [];
    uu.recentActivity.unshift({
      gameId,
      title: g ? g.title : gameId,
      date: Date.now(),
      durationSeconds: elapsedSeconds,
    });
    uu.recentActivity = uu.recentActivity.slice(0, 15);
  });
  if (u) {
    notifyNewAchievements(u);
    recordActivity("gamesPlayed");
    toast(
      `${g ? g.title : "Session"}: ${formatDuration(elapsedSeconds)} played (+${coinsEarned} coins).`,
    );
    renderCoinsBadge();
    refreshDynamicViews();
  }
}
// Detect the player returning to the launcher tab/window after a play session.
window.addEventListener("focus", stopPlaySessionIfActive);

/* ============================================================
   ADDED — WALLET (top-up simulation only, no real payments)
   ============================================================ */
function renderWallet() {
  const user = currentUser();
  if (!user) return;
  ensureUserDefaults(user);

  document.getElementById("walletBalance").textContent =
    "$" + user.wallet.toFixed(2);
  renderDailyBonusCard(user);
  renderMysteryBoxCard();

  renderTopupAmountGrid();

  if (user.savedCard) {
    document.getElementById("cardHolder").value = user.savedCard.holder;
    document.getElementById("cardNumber").value = user.savedCard.number;
    document.getElementById("cardExpiry").value = user.savedCard.expiry;
    // CVV is intentionally never saved/restored — see processTopup().
    document.getElementById("saveCardCheckbox").checked = true;
  }
  updateCardPreview();

  const history = [...user.topups].sort((a, b) => b.date - a.date);
  document.getElementById("topupHistoryList").innerHTML = history.length
    ? history
        .map(
          (h) => `
    <div class="history-item">
      <div class="history-icon">💳</div>
      <div class="history-info">
        <div class="history-amount">+$${h.amount.toFixed(2)}</div>
        <div class="history-meta">${h.method} •••• ${h.last4} — ${new Date(h.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  `,
        )
        .join("")
    : `
    <div class="empty-state">
      <div class="eyebrow">No Top-Ups Yet</div>
      <p>Your top-up history will show up here once you add funds.</p>
    </div>`;
}

function renderTopupAmountGrid() {
  document.getElementById("topupAmountGrid").innerHTML = TOPUP_PRESETS.map(
    (a) => `
    <button class="amount-btn ${selectedTopupAmount === a ? "selected" : ""}" onclick="selectTopupAmount(${a})">$${a}</button>
  `,
  ).join("");
}
function selectTopupAmount(a) {
  selectedTopupAmount = a;
  document.getElementById("customTopupAmount").value = "";
  renderTopupAmountGrid();
}
function onCustomTopupInput() {
  selectedTopupAmount = null;
  renderTopupAmountGrid();
}

function formatCardNumberInput(el) {
  const digits = el.value.replace(/\D/g, "").slice(0, 16);
  el.value = digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiryInput(el) {
  let digits = el.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) digits = digits.slice(0, 2) + "/" + digits.slice(2);
  el.value = digits;
}
function detectCardBrand(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "MasterCard";
  return "Card";
}
function updateCardPreview() {
  const holder = document.getElementById("cardHolder").value.trim();
  const number = document.getElementById("cardNumber").value;
  const expiry = document.getElementById("cardExpiry").value;
  const digits = number.replace(/\D/g, "");
  const masked = (digits + "••••••••••••••••".slice(digits.length))
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
  document.getElementById("cardPreviewNumber").textContent =
    masked || "•••• •••• •••• ••••";
  document.getElementById("cardPreviewHolder").textContent = holder
    ? holder.toUpperCase()
    : "CARD HOLDER";
  document.getElementById("cardPreviewExpiry").textContent = expiry || "MM/YY";
}

function processTopup() {
  const customVal = parseFloat(
    document.getElementById("customTopupAmount").value,
  );
  const amount =
    !isNaN(customVal) && customVal > 0
      ? Math.round(customVal * 100) / 100
      : selectedTopupAmount;
  if (!amount || amount <= 0) {
    toast("Enter a valid amount.");
    return;
  }

  const holder = document.getElementById("cardHolder").value.trim();
  const number = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvv = document.getElementById("cardCVV").value.trim();
  const save = document.getElementById("saveCardCheckbox").checked;

  if (!holder || !number || !expiry || !cvv) {
    toast("Fill in all card fields.");
    return;
  }
  if (number.replace(/\D/g, "").length < 12) {
    toast("Enter a valid card number.");
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    toast("Expiration date must be MM/YY.");
    return;
  }
  if (cvv.length < 3) {
    toast("CVV looks too short.");
    return;
  }

  const last4 = number.replace(/\D/g, "").slice(-4);
  const brand = detectCardBrand(number);

  const u = persistCurrentUser((uu) => {
    uu.wallet = Math.round((uu.wallet + amount) * 100) / 100;
    uu.topups.push({ amount, method: brand, last4, date: Date.now() });
    uu.savedCard = save ? { holder, number, expiry } : null;
  });

  notifyNewAchievements(u);
  showTopupSuccess(amount);
  renderWallet();
}

function showTopupSuccess(amount) {
  document.getElementById("modalMount").innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="modal-body thanks-modal">
          <div class="thanks-icon">✓</div>
          <div class="thanks-title">Top-Up Successful</div>
          <div class="thanks-desc">$${amount.toFixed(2)} has been added to your Pixel&amp;Games wallet.</div>
          <button class="btn-sm gold" style="width:100%;" onclick="closeModal()">Nice!</button>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   ADDED — PARTNERSHIP + ADVERTISEMENTS (UI simulation only)
   ============================================================ */
const PARTNERSHIP_KEY = "pixelgames_partnership_requests";
const AD_REQUEST_KEY = "pixelgames_ad_requests";

const PARTNERSHIP_FAQ = [
  {
    q: "How long does approval take?",
    a: "Most applications are reviewed within 5–7 business days. You'll hear back by email either way.",
  },
  {
    q: "Does it cost money?",
    a: "No. Listing your game on Pixel&Games is free — we only take a small share of paid sales.",
  },
  {
    q: "Can indie developers apply?",
    a: "Absolutely. Solo developers and small studios make up most of our current partners.",
  },
  {
    q: "What are the technical requirements?",
    a: "Your game just needs a playable build. We'll guide you through packaging it for the launcher.",
  },
];

const AD_FAQ = [
  {
    q: "How is ad performance tracked?",
    a: "This page is a design preview — no real tracking or ad delivery is connected.",
  },
  {
    q: "Can I choose where my ad appears?",
    a: "Yes, placement preferences can be discussed once you submit a request.",
  },
  {
    q: "What file formats are supported?",
    a: "Typically PNG, JPG, or MP4 for video slots — final specs are shared after approval.",
  },
  {
    q: "Is there a minimum campaign length?",
    a: "Most packages run monthly, but shorter test campaigns can be arranged on request.",
  },
];

function renderFAQList(containerId, items) {
  const el = document.getElementById(containerId);
  el.innerHTML = items
    .map(
      (item, i) => `
    <div class="glass-card faq-item" id="${containerId}-${i}">
      <button class="faq-q" onclick="toggleFAQ('${containerId}-${i}')">
        <span>${item.q}</span><span class="faq-arrow">▾</span>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
    </div>
  `,
    )
    .join("");
}
function toggleFAQ(id) {
  document.getElementById(id).classList.toggle("open");
}

function animateStatEls(root) {
  root.querySelectorAll(".stat-strip-value[data-target]").forEach((el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = "1";
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

function renderPartnershipView() {
  renderFAQList("partnershipFAQ", PARTNERSHIP_FAQ);
  animateStatEls(document.getElementById("partnershipView"));
}
function renderAdvertisementsView() {
  renderFAQList("adFAQ", AD_FAQ);
}

function showFormError(msgElId, text) {
  const el = document.getElementById(msgElId);
  el.textContent = text;
  el.className = "form-msg show error";
}
function hideFormError(msgElId) {
  document.getElementById(msgElId).className = "form-msg";
}
function markFieldError(el, isError) {
  el.classList.toggle("err", isError);
}
function isValidEmailLoose(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function isValidUrlLoose(v) {
  return /^https?:\/\/[^\s]+\.[^\s]+/.test(v.trim());
}

function submitPartnership(e) {
  e.preventDefault();
  const fields = {
    studio: document.getElementById("pStudio"),
    devName: document.getElementById("pDevName"),
    email: document.getElementById("pEmail"),
    gameName: document.getElementById("pGameName"),
    genre: document.getElementById("pGenre"),
    website: document.getElementById("pWebsite"),
    message: document.getElementById("pMessage"),
  };
  let firstError = null;
  Object.values(fields).forEach((f) => markFieldError(f, false));

  if (!fields.studio.value.trim()) {
    markFieldError(fields.studio, true);
    firstError = firstError || "Studio name is required.";
  }
  if (!fields.devName.value.trim()) {
    markFieldError(fields.devName, true);
    firstError = firstError || "Developer name is required.";
  }
  if (!isValidEmailLoose(fields.email.value)) {
    markFieldError(fields.email, true);
    firstError = firstError || "Enter a valid email address.";
  }
  if (!fields.gameName.value.trim()) {
    markFieldError(fields.gameName, true);
    firstError = firstError || "Game name is required.";
  }
  if (!fields.genre.value) {
    markFieldError(fields.genre, true);
    firstError = firstError || "Select a game genre.";
  }
  if (!isValidUrlLoose(fields.website.value)) {
    markFieldError(fields.website, true);
    firstError = firstError || "Enter a valid website URL (https://...).";
  }
  if (!fields.message.value.trim()) {
    markFieldError(fields.message, true);
    firstError = firstError || "Message is required.";
  }

  if (firstError) {
    showFormError("partnershipMsg", firstError);
    return false;
  }
  hideFormError("partnershipMsg");

  const request = {
    studio: fields.studio.value.trim(),
    devName: fields.devName.value.trim(),
    email: fields.email.value.trim(),
    gameName: fields.gameName.value.trim(),
    genre: fields.genre.value,
    website: fields.website.value.trim(),
    message: fields.message.value.trim(),
    date: Date.now(),
  };
  const list = JSON.parse(localStorage.getItem(PARTNERSHIP_KEY) || "[]");
  list.push(request);
  localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify(list));

  showSimpleSuccess(
    "Request Sent",
    "Thanks! Our partnerships team will reach out to " +
      request.email +
      " soon.",
  );
  clearPartnershipForm();
  return false;
}
function clearPartnershipForm() {
  document.getElementById("partnershipForm").reset();
  document
    .querySelectorAll(
      "#partnershipForm input, #partnershipForm select, #partnershipForm textarea",
    )
    .forEach((f) => markFieldError(f, false));
  hideFormError("partnershipMsg");
}

function submitAdRequest(e) {
  e.preventDefault();
  const fields = {
    company: document.getElementById("aCompany"),
    email: document.getElementById("aEmail"),
    website: document.getElementById("aWebsite"),
    type: document.getElementById("aType"),
    budget: document.getElementById("aBudget"),
    message: document.getElementById("aMessage"),
  };
  let firstError = null;
  Object.values(fields).forEach((f) => markFieldError(f, false));

  if (!fields.company.value.trim()) {
    markFieldError(fields.company, true);
    firstError = firstError || "Company name is required.";
  }
  if (!isValidEmailLoose(fields.email.value)) {
    markFieldError(fields.email, true);
    firstError = firstError || "Enter a valid email address.";
  }
  if (!isValidUrlLoose(fields.website.value)) {
    markFieldError(fields.website, true);
    firstError = firstError || "Enter a valid website URL (https://...).";
  }
  if (!fields.type.value) {
    markFieldError(fields.type, true);
    firstError = firstError || "Select an advertisement type.";
  }
  if (!fields.budget.value.trim()) {
    markFieldError(fields.budget, true);
    firstError = firstError || "Budget is required.";
  }
  if (!fields.message.value.trim()) {
    markFieldError(fields.message, true);
    firstError = firstError || "Message is required.";
  }

  if (firstError) {
    showFormError("adMsg", firstError);
    return false;
  }
  hideFormError("adMsg");

  const request = {
    company: fields.company.value.trim(),
    email: fields.email.value.trim(),
    website: fields.website.value.trim(),
    type: fields.type.value,
    budget: fields.budget.value.trim(),
    message: fields.message.value.trim(),
    date: Date.now(),
  };
  const list = JSON.parse(localStorage.getItem(AD_REQUEST_KEY) || "[]");
  list.push(request);
  localStorage.setItem(AD_REQUEST_KEY, JSON.stringify(list));

  showSimpleSuccess(
    "Request Submitted",
    "Thanks! Our advertising team will contact " + request.email + " shortly.",
  );
  clearAdForm();
  return false;
}
function clearAdForm() {
  document.getElementById("adForm").reset();
  document
    .querySelectorAll("#adForm input, #adForm select, #adForm textarea")
    .forEach((f) => markFieldError(f, false));
  hideFormError("adMsg");
}

function choosePackage(name) {
  document.getElementById("aType").value =
    name === "Starter"
      ? "Medium Banner"
      : name === "Premium"
        ? "Large Hero Banner"
        : "Featured Advertisement";
  document
    .getElementById("adFormPanel")
    .scrollIntoView({ behavior: "smooth", block: "start" });
  toast(name + " package selected — fill in your details below.");
}

function showSimpleSuccess(title, desc) {
  document.getElementById("modalMount").innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="modal-body thanks-modal">
          <div class="thanks-icon">✓</div>
          <div class="thanks-title">${title}</div>
          <div class="thanks-desc">${desc}</div>
          <button class="btn-sm gold" style="width:100%;" onclick="closeModal()">Done</button>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ============================================================
   Vault dial ticks (decorative)
   ============================================================ */
(function buildTicks() {
  const ring = document.querySelector(".vault-ring.spin");
  for (let i = 0; i < 24; i++) {
    const t = document.createElement("div");
    t.className = "vault-tick";
    t.style.transform = `rotate(${i * 15}deg)`;
    ring.appendChild(t);
  }
})();

/* ============================================================
   Boot: restore session if present
   ============================================================ */
(function boot() {
  const user = currentUser();
  if (user) {
    if (ensureUserDefaults(user)) {
      const users = getUsers();
      users[user.gmail] = user;
      saveUsers(users);
    }
    enterApp();
  }
})();

/* ============================================================
   Pixel AI — offline keyword-matched assistant (this block) PLUS
   a real AI-backed layer (see the PIXEL AI section near the end of
   this file) that only activates for messages this offline layer
   can't confidently answer, and for the once-per-day personalized
   greeting. Reuses existing globals (CATALOG, switchView,
   currentUser, toast) from the main script above — nothing there
   was modified.
   ============================================================ */

const AI_CHAT_KEY = "pixelgames_ai_chat_history";
const AI_THEME_KEY = "pixelgames_ai_theme";
const AI_LANG_KEY = "pixelgames_ai_language";
const AI_CMDS_KEY = "pixelgames_ai_recent_commands";

let aiHistory = [];
let aiTypingEl = null;

/* ---------- storage helpers ---------- */
function aiLoadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function aiSaveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function aiUid() {
  return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ============================================================
   KNOWLEDGE BASE — topic keywords + multiple varied responses
   ============================================================ */
const AI_KB = [
  {
    id: "greeting",
    keywords: [
      "hi",
      "hello",
      "hey",
      "yo",
      "sup",
      "greetings",
      "good morning",
      "good evening",
    ],
    responses: [
      "Hey there! 👋 I'm Pixel AI. Ask me about the Store, your Library, Wallet, or type /help.",
      "Hello! Great to see you. What are we exploring today — games, your wallet, or something else?",
      "Hi! Ready to help. Try asking about achievements, wishlists, or just type /help for commands.",
    ],
  },
  {
    id: "howareyou",
    keywords: ["how are you", "how r u", "how you doing", "hows it going"],
    responses: [
      "Running smoothly and fully offline! How can I help you on Pixel&Games today?",
      "Doing great, thanks for asking! What can I look up for you?",
      "All systems good on my end 🤖 What do you need help with?",
    ],
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thx", "appreciate it", "ty"],
    responses: [
      "Anytime! Let me know if there's anything else you need.",
      "You're welcome! Happy gaming 🎮",
      "Glad I could help!",
    ],
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "later", "cya"],
    responses: [
      "See you soon! I'll be right here if you need me again.",
      "Take care! Come back anytime.",
      "Bye for now 👋",
    ],
  },
  {
    id: "pixelgames",
    keywords: [
      "pixel&games",
      "pixel and games",
      "pixelgames",
      "what is this site",
      "what is this platform",
    ],
    responses: [
      "Pixel&Games is your personal game launcher — browse the Store, build your Library, top up your Wallet, and track your Profile stats all in one place.",
      "This is Pixel&Games, a launcher for discovering, buying, and playing games, with achievements, a wishlist, and more.",
      "Pixel&Games lets you collect games in your Library, manage a Wallet balance, and level up your Profile with XP and achievements.",
    ],
  },
  {
    id: "about",
    keywords: ["about pixel", "tell me about the site", "explain pixel games"],
    responses: [
      "Pixel&Games combines a Store, a personal Library, a Wallet for top-ups, and a Profile with XP, achievements, and stats — plus Partnership and Advertising pages for businesses.",
      "In short: browse games in the Store, own them in your Library, fund purchases through your Wallet, and track progress in your Profile.",
    ],
  },
  {
    id: "store",
    keywords: [
      "store",
      "shop",
      "buy games",
      "browse games",
      "catalog",
      "purchase a game",
    ],
    responses: [
      "The Store is where you browse all available games — some are free, some are paid. Use the heart to wishlist a title or the star to favorite it.",
      "Head to the Store tab to see the full catalog. Paid games show a price and a Buy button; free games just need a click to add.",
      "In the Store you can view details on any game, favorite it, wishlist it, or buy/add it straight to your Library.",
    ],
  },
  {
    id: "library",
    keywords: [
      "library",
      "my games",
      "owned games",
      "installed games",
      "my collection",
    ],
    responses: [
      "Your Library shows every game you own. Hit Play on any card to launch it.",
      "Anything you've bought or added from the Store lands in your Library, ready to play.",
      "The Library tab lists your owned titles — click Play to open one.",
    ],
  },
  {
    id: "wallet",
    keywords: [
      "wallet",
      "balance",
      "top up",
      "topup",
      "add funds",
      "add money",
      "my money",
    ],
    responses: [
      "The Wallet page shows your balance and lets you top up using a simulated card form — pick a preset amount or enter a custom one.",
      "You can add funds in the Wallet tab. Fill in the card form, hit Top Up, and your balance updates instantly — all saved locally.",
      "Need funds for a paid game? Open the Wallet tab, choose an amount, and top up. Your history is saved right there too.",
    ],
  },
  {
    id: "profile",
    keywords: [
      "profile",
      "account info",
      "my stats",
      "avatar",
      "nickname",
      "my account",
    ],
    responses: [
      "Your Profile shows your avatar, level, XP bar, games owned, hours played, achievements, and wishlist count.",
      "Head to Profile to change your avatar, update your nickname, switch the accent theme, or check your stats.",
      "Profile is your hub for stats and settings — XP, level, achievements, and account details all live there.",
    ],
  },
  {
    id: "login",
    keywords: [
      "login",
      "log in",
      "sign in",
      "signin",
      "enter account",
      "access account",
      "how do i log in",
    ],
    responses: [
      "To log in, enter your Gmail and password on the sign-in screen and hit Enter Vault.",
      "Use the Sign In tab on the welcome screen — your Gmail and password, and you're in.",
      "Logging in just needs your Gmail and password on the auth screen.",
    ],
  },
  {
    id: "registration",
    keywords: [
      "register",
      "registration",
      "sign up",
      "signup",
      "create account",
      "new account",
      "make an account",
    ],
    responses: [
      "To register, switch to the Register tab and fill in your Nickname, Gmail, and a password of at least 6 characters.",
      "Creating an account takes seconds — Nickname, Gmail, Password (6+ characters), then Create Account.",
      "Hit Register on the welcome screen, fill in your details, and you're automatically logged in afterward.",
    ],
  },
  {
    id: "settings",
    keywords: [
      "settings",
      "preferences",
      "options",
      "configure account",
      "change nickname",
    ],
    responses: [
      "Settings live inside your Profile page — you can change your nickname, avatar, and accent theme there, and it saves automatically.",
      "Open Profile and scroll to the Settings card to update your nickname, avatar, or theme.",
      "You'll find nickname, avatar, and theme controls in the Settings section of your Profile.",
    ],
  },
  {
    id: "darkmode",
    keywords: ["dark mode", "darkmode", "dark theme"],
    responses: [
      "The whole launcher uses a dark, glassmorphism-inspired look by default.",
      "Pixel&Games is dark-themed throughout — easy on the eyes for long sessions.",
      "I can switch just this chat window's look with /theme, though the main site stays dark by design.",
    ],
  },
  {
    id: "lightmode",
    keywords: ["light mode", "lightmode", "light theme", "bright mode"],
    responses: [
      "The site itself is dark-styled by design, but you can toggle this chat window's theme with /theme.",
      "There's no site-wide light mode right now — but try /theme to lighten up our conversation.",
      "This chat panel can switch to a lighter look via /theme, independent of the main site design.",
    ],
  },
  {
    id: "language",
    keywords: ["language", "languages", "translate", "change language"],
    responses: [
      "Right now everything is in English — try /language to see the current setting, more languages may come later.",
      "I only speak English at the moment, but your language preference is saved for when more are added.",
      "Language support is English-only for now — I'll remember your preference either way.",
    ],
  },
  {
    id: "partnership",
    keywords: [
      "partnership",
      "partner",
      "developer",
      "publish my game",
      "collaborate",
      "become a partner",
    ],
    responses: [
      "Game developers can apply on the Partnership page — fill in your studio, game details, and genre, and our team reviews it.",
      "Head to Partnership if you're a developer wanting to publish — there's a benefits list, stats, and an application form.",
      "The Partnership page covers why to publish with us, plus a request form and FAQ for developers.",
    ],
  },
  {
    id: "advertisements",
    keywords: [
      "advertise",
      "advertising",
      "ads",
      "sponsor",
      "marketing",
      "promote my brand",
    ],
    responses: [
      "Companies can check out ad formats and pricing packages on the Advertisements page, then submit a request form.",
      "The Advertisements page shows banner formats, sponsor spotlights, and Starter/Premium/Ultimate packages.",
      "If you want to advertise, visit the Advertisements tab — pick a package and fill in the request form.",
    ],
  },
  {
    id: "paidgames",
    keywords: [
      "paid games",
      "buy a game",
      "premium games",
      "purchase game",
      "how much is",
    ],
    responses: [
      "Paid games show their price right on the card — buy them with your Wallet balance and they land in your Library.",
      "Some titles cost money; the Buy button shows the exact price, deducted straight from your Wallet.",
      "Paid games need enough Wallet balance — if you're short, I can send you to the Wallet page any time.",
    ],
  },
  {
    id: "freegames",
    keywords: ["free games", "free game", "no cost games", "games for free"],
    responses: [
      "Free games just need an Add click in the Store — no Wallet balance required.",
      "Several titles in the Store are completely free — look for the FREE badge on the card.",
      "Free games skip the Wallet entirely — Add them straight to your Library.",
    ],
  },
  {
    id: "wishlist",
    keywords: ["wishlist", "wish list", "save for later", "games i want"],
    responses: [
      "Tap the heart icon on any Store card to add it to your Wishlist — you'll see the count on your Profile.",
      "The heart icon on a game card toggles it in and out of your Wishlist.",
      "Wishlisted games show up in your Profile stats, though the list itself lives on the card icons for now.",
    ],
  },
  {
    id: "favorites",
    keywords: [
      "favorite",
      "favourite",
      "favorites",
      "favourites",
      "star a game",
    ],
    responses: [
      "Click the star on a Store card to mark a game as a favorite — your most recent favorite shows on your Profile.",
      "Favorites are toggled with the star icon on each game card in the Store.",
      "Your favorite count and most recent favorite both appear on the Profile page.",
    ],
  },
  {
    id: "notifications",
    keywords: ["notification", "notifications", "alerts", "pop up messages"],
    responses: [
      "Right now feedback comes through toast messages and popups — for purchases, top-ups, and achievements.",
      "You'll see small toast notifications after actions like buying a game or unlocking an achievement.",
      "There's no separate notifications inbox yet — actions confirm instantly via toast messages and modals.",
    ],
  },
  {
    id: "achievements",
    keywords: [
      "achievement",
      "achievements",
      "badge",
      "badges",
      "trophy",
      "trophies",
    ],
    responses: [
      "Achievements like First Login, First Top-Up, and Collector are shown as badges on your Profile — locked ones are grayed out.",
      "Check your Profile page for the Achievements grid — unlock them by playing, buying, and favoriting games.",
      "There are achievements for logging in, topping up your wallet, adding games, favoriting, and more — all visible on Profile.",
    ],
  },
  {
    id: "statistics",
    keywords: ["statistics", "stats", "playtime", "hours played", "my numbers"],
    responses: [
      "Your Profile shows Games Owned, Hours Played, Achievements, and Wishlist count as quick stat cards.",
      "Stats live on the Profile page — games owned, playtime, achievement progress, and more.",
      "Check Profile for a snapshot of your stats: library size, hours played, achievements, and favorites.",
    ],
  },
  {
    // ADDED — Pixel AI: answered offline (no AI call) so the numbers
    // always exactly match the real economy constants above and this
    // never costs an AI API request.
    id: "coins_earning",
    keywords: [
      "earn coins",
      "earn more coins",
      "earn more coin",
      "how do i earn coins",
      "get more coins",
      "get coins",
      "how to get coins",
      "how can i earn",
      "coins guide",
      "how does coins work",
      "how do coins work",
    ],
    responses: [
      `Ways to earn Coins: Daily Bonus (+${COINS_FROM_DAILY_BONUS} every 24h), playing games (+${COINS_PER_MINUTE_PLAYED}/minute), adding a free game (+${COINS_FROM_FREE_ADD}), buying a paid game (+${COINS_PER_DOLLAR_SPENT} per $1 spent), and activating Premium (+${COINS_FROM_PREMIUM} one-time).`,
      `The fastest ways to stack Coins: claim your Daily Bonus (+${COINS_FROM_DAILY_BONUS}), rack up playtime (+${COINS_PER_MINUTE_PLAYED}/min), or go Premium for a +${COINS_FROM_PREMIUM} bonus.`,
      `Coins come from: Daily Bonus (+${COINS_FROM_DAILY_BONUS}/day), playtime (+${COINS_PER_MINUTE_PLAYED} per minute), free game adds (+${COINS_FROM_FREE_ADD}), purchases (+${COINS_PER_DOLLAR_SPENT} per $1), and Premium activation (+${COINS_FROM_PREMIUM} once).`,
    ],
  },
  {
    id: "html",
    keywords: ["html", "hypertext markup"],
    responses: [
      "HTML is the markup language that structures web pages — this whole launcher is built with it.",
      "HTML defines the structure of a page: headings, buttons, forms, and more.",
      "Fun fact: this entire site — Store, Wallet, Profile — is plain HTML under the hood.",
    ],
  },
  {
    id: "css",
    keywords: ["css", "stylesheet", "styling"],
    responses: [
      "CSS handles styling — colors, layout, animations. This site's glassmorphism look comes straight from CSS.",
      "CSS is what makes things look good: gradients, blur effects, hover animations, all CSS.",
      "Without CSS, this launcher would just be plain text and buttons — CSS gives it the premium look.",
    ],
  },
  {
    id: "javascript",
    keywords: ["javascript", "js", "vanilla js"],
    responses: [
      "JavaScript is what makes this whole launcher interactive — including me! I'm built with 100% vanilla JS, no frameworks.",
      "JavaScript handles the logic: login, the Store, the Wallet, and this chat — all vanilla, no external libraries.",
      "I run on vanilla JavaScript, no frameworks — most of my answers are instant local JS logic, with a small backend call only for the trickier, personalized questions.",
    ],
  },
  {
    id: "programming",
    keywords: [
      "programming",
      "coding",
      "how to code",
      "learn to program",
      "developer skills",
    ],
    responses: [
      "Programming is basically giving a computer precise instructions — HTML, CSS, and JS are a great starting trio for the web.",
      "If you're learning to code, building small projects like a chat widget (like me!) is a great way to practice.",
      "Programming languages differ in style, but the core idea — solving problems step by step — stays the same.",
    ],
  },
  {
    id: "gaming",
    keywords: ["gaming", "video games", "games in general", "pc gaming"],
    responses: [
      "Gaming is what Pixel&Games is all about! Browse the Store to find something new to play.",
      "Whether it's puzzle, horror, or strategy — the Store has a genre for every kind of gamer.",
      "Nothing beats a good game session — check the Library for what you already own.",
    ],
  },
  {
    id: "pc",
    keywords: ["pc", "computer", "laptop", "hardware"],
    responses: [
      "This launcher runs right in your browser, so any reasonably modern PC or laptop will handle it fine.",
      "No special hardware needed — Pixel&Games is a lightweight, browser-based experience.",
      "Since everything runs locally in your browser, performance depends mostly on your browser, not heavy hardware.",
    ],
  },
  {
    id: "technology",
    keywords: ["technology", "tech", "software", "browser"],
    responses: [
      "This entire launcher — auth, Store, Wallet, and me — runs client-side with HTML, CSS, and JavaScript, no backend required.",
      "Modern web tech like LocalStorage lets a site like this remember your data without any server.",
      "Everything here is built with core web technology: no frameworks, no external services, just the browser.",
    ],
  },
];

const AI_FALLBACKS = [
  "I don't have information about that yet. Try asking me about Pixel&Games, programming, the Store, Library, Wallet, or use /help.",
  "Hmm, I'm not sure about that one. Type /help to see what I can do, or ask about the Store, Wallet, or Profile.",
  "That's outside what I know right now. Try /help for a list of commands, or ask about games, achievements, or your account.",
];

function aiPickResponse(text) {
  const norm = text.toLowerCase();
  let best = null,
    bestScore = 0;
  AI_KB.forEach((topic) => {
    let score = 0;
    topic.keywords.forEach((k) => {
      if (norm.includes(k)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  });
  // ADDED — Pixel AI: no confident offline keyword match. Return null
  // instead of a random fallback string so the caller (aiSendMessage)
  // can try a real AI-backed answer before giving up.
  if (!best) return null;
  return best.responses[Math.floor(Math.random() * best.responses.length)];
}
function aiFallbackText() {
  return AI_FALLBACKS[Math.floor(Math.random() * AI_FALLBACKS.length)];
}

/* ============================================================
   COMMANDS
   ============================================================ */
function aiIsLoggedIn() {
  const shell = document.getElementById("appShell");
  return shell && !shell.classList.contains("hidden");
}
function aiPushRecentCommand(cmd) {
  const list = aiLoadJSON(AI_CMDS_KEY, []);
  list.unshift(cmd);
  aiSaveJSON(AI_CMDS_KEY, list.slice(0, 10));
}
function aiGoTo(view, label) {
  if (!aiIsLoggedIn()) {
    aiRespondWithDelay(
      `You'll need to log in first before I can open ${label} for you.`,
    );
    return;
  }
  switchView(view);
  aiRespondWithDelay(`Opening ${label} for you now. ✅`);
}

function aiHandleCommand(raw) {
  const cmd = raw.trim().split(/\s+/)[0].toLowerCase();
  aiPushRecentCommand(cmd);

  switch (cmd) {
    case "/help":
      aiRespondWithDelay(
        "Here's what I can do:\n" +
          "/help — show this list\n/store — open the Store\n/library — open your Library\n" +
          "/wallet — open the Wallet\n/profile — open your Profile\n/settings — open Settings\n" +
          "/friends — open Friends\n" +
          "/partner — open Partnership\n/ads — open Advertisements\n/games — list all games\n" +
          "/theme — toggle my chat theme\n/language — check language\n/clear — clear this chat\n" +
          "/history — show recent messages\n/about — what is Pixel&Games",
      );
      break;
    case "/games":
      if (typeof CATALOG !== "undefined") {
        const list = CATALOG.map(
          (g) =>
            `• ${g.title} — ${g.price > 0 ? "$" + g.price.toFixed(2) : "FREE"}`,
        ).join("\n");
        aiRespondWithDelay("Here are all 6 games on Pixel&Games:\n" + list);
      } else {
        aiRespondWithDelay(
          "I couldn't reach the game catalog just now — try opening the Store directly.",
        );
      }
      break;
    case "/store":
      aiGoTo("store", "the Store");
      break;
    case "/library":
      aiGoTo("library", "your Library");
      break;
    case "/wallet":
      aiGoTo("wallet", "the Wallet");
      break;
    case "/profile":
      aiGoTo("profile", "your Profile");
      break;
    case "/settings":
      aiGoTo("profile", "Settings (inside your Profile)");
      break;
    case "/friends":
      aiGoTo("friends", "the Friends page");
      break;
    case "/partner":
      aiGoTo("partnership", "the Partnership page");
      break;
    case "/ads":
      aiGoTo("advertisements", "the Advertisements page");
      break;
    case "/theme":
      aiToggleTheme();
      break;
    case "/language": {
      const lang = aiLoadJSON(AI_LANG_KEY, "en");
      aiRespondWithDelay(
        lang === "en"
          ? "Current language: English. More languages may be added in the future — your preference is saved."
          : "Language preference saved. For now, all responses are in English.",
      );
      break;
    }
    case "/clear":
      aiClearChat();
      break;
    case "/history": {
      const recent = aiHistory
        .filter((m) => m.role === "user")
        .slice(-5)
        .map((m) => "• " + m.text)
        .join("\n");
      aiRespondWithDelay(
        recent
          ? "Your last few messages:\n" + recent
          : "No previous messages yet — this is a fresh start!",
      );
      break;
    }
    case "/about":
      aiRespondWithDelay(
        "Pixel&Games is a game launcher with a Store, Library, Wallet, Profile with achievements, and dedicated Partnership and Advertising pages — all running on plain HTML, CSS, and JavaScript.",
      );
      break;
    default:
      aiRespondWithDelay(
        `Unknown command "${cmd}". Type /help to see everything I can do.`,
      );
  }
}

/* ============================================================
   THEME (scoped to the chat widget only — site design untouched)
   ============================================================ */
function aiApplyTheme() {
  const theme = aiLoadJSON(AI_THEME_KEY, "dark");
  const panel = document.getElementById("aiPanel");
  if (theme === "light") {
    panel.style.setProperty("--glass-bg", "rgba(20,18,30,0.06)");
    panel.style.setProperty("--glass-bg-strong", "rgba(20,18,30,0.1)");
    panel.style.setProperty("--glass-border", "rgba(20,18,30,0.15)");
    panel.style.setProperty("--text", "#241f33");
    panel.style.setProperty("--text-muted", "#5a5468");
    panel.style.setProperty("--text-faint", "#8a84999");
    panel.style.background = "linear-gradient(165deg, #f4f1fa, #e9e4f5)";
  } else {
    panel.style.removeProperty("--glass-bg");
    panel.style.removeProperty("--glass-bg-strong");
    panel.style.removeProperty("--glass-border");
    panel.style.removeProperty("--text");
    panel.style.removeProperty("--text-muted");
    panel.style.removeProperty("--text-faint");
    panel.style.background = "";
  }
}
function aiToggleTheme() {
  const current = aiLoadJSON(AI_THEME_KEY, "dark");
  const next = current === "dark" ? "light" : "dark";
  aiSaveJSON(AI_THEME_KEY, next);
  aiApplyTheme();
  aiRespondWithDelay(
    next === "light"
      ? "Switched my chat window to a lighter look. 🌞 (The main site keeps its dark design.)"
      : "Back to dark mode for our chat. 🌙",
  );
}

/* ============================================================
   CHAT RENDERING
   ============================================================ */
function aiRenderMessages() {
  const el = document.getElementById("aiMessages");
  el.innerHTML = aiHistory
    .map(
      (m) => `
    <div class="ai-msg-row ${m.role}">
      <div class="ai-bubble">${m.text.replace(/</g, "&lt;")}</div>
      <div class="ai-msg-meta">
        <span>${new Date(m.time).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
        <button onclick="aiCopyMessage('${m.id}')" title="Copy">📋</button>
        <button onclick="aiDeleteMessage('${m.id}')" title="Delete">🗑</button>
      </div>
    </div>
  `,
    )
    .join("");
  aiScrollToBottom();
}
function aiScrollToBottom() {
  const el = document.getElementById("aiMessages");
  el.scrollTop = el.scrollHeight;
}

function aiAddMessage(role, text) {
  const msg = { id: aiUid(), role, text, time: Date.now() };
  aiHistory.push(msg);
  aiSaveJSON(AI_CHAT_KEY, aiHistory);
  aiRenderMessages();
}

function aiShowTyping() {
  const el = document.getElementById("aiMessages");
  aiTypingEl = document.createElement("div");
  aiTypingEl.className = "ai-msg-row bot";
  aiTypingEl.innerHTML = `<div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>`;
  el.appendChild(aiTypingEl);
  aiScrollToBottom();
}
function aiHideTyping() {
  if (aiTypingEl && aiTypingEl.parentNode) {
    aiTypingEl.parentNode.removeChild(aiTypingEl);
  }
  aiTypingEl = null;
}
function aiRespondWithDelay(text) {
  aiShowTyping();
  const delay = 450 + Math.random() * 550;
  setTimeout(() => {
    aiHideTyping();
    aiAddMessage("bot", text);
  }, delay);
}

function aiCopyMessage(id) {
  const msg = aiHistory.find((m) => m.id === id);
  if (!msg) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(msg.text)
      .then(() => toast("Message copied."))
      .catch(() => toast("Could not copy."));
  } else {
    toast("Copy not supported in this browser.");
  }
}
function aiDeleteMessage(id) {
  aiHistory = aiHistory.filter((m) => m.id !== id);
  aiSaveJSON(AI_CHAT_KEY, aiHistory);
  aiRenderMessages();
}
function aiClearChat() {
  if (aiHistory.length && !confirm("Clear the entire chat history?")) return;
  aiHistory = [];
  aiSaveJSON(AI_CHAT_KEY, aiHistory);
  aiAddMessage(
    "bot",
    "Chat cleared! I'm still here whenever you need me. Type /help to see what I can do.",
  );
}

/* ============================================================
   SEND / PANEL TOGGLE
   ============================================================ */
function aiSendMessage() {
  const input = document.getElementById("aiInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  aiAddMessage("user", text);

  if (text.startsWith("/")) {
    aiHandleCommand(text);
    return;
  }

  // Free, instant, offline keyword match first — zero cost, zero
  // network. Only escalate to the real Pixel AI backend (/api/ai)
  // when nothing in AI_KB confidently matches.
  const offline = aiPickResponse(text);
  if (offline) {
    aiRespondWithDelay(offline);
    return;
  }
  pixelAIAskChat(text);
}

function toggleAIPanel(force) {
  const panel = document.getElementById("aiPanel");
  const willOpen =
    typeof force === "boolean" ? force : !panel.classList.contains("open");
  panel.classList.toggle("open", willOpen);
  if (willOpen) {
    if (aiHistory.length === 0) {
      aiAddMessage(
        "bot",
        "Hey! I'm Pixel AI, your personal Pixel&Games assistant. Ask me anything, or try a quick action below.",
      );
    }
    // ADDED — Pixel AI: surface the (at most once/day) AI-generated
    // personalized greeting the first time the panel opens after it
    // was fetched. See pixelAIMaybeFetchDailyGreeting.
    if (pixelAIPendingGreeting) {
      const text = pixelAIPendingGreeting;
      pixelAIPendingGreeting = null;
      const lastBot = [...aiHistory].reverse().find((m) => m.role === "bot");
      if (!lastBot || lastBot.text !== text) {
        aiAddMessage("bot", text);
      }
    }
    setTimeout(() => document.getElementById("aiInput").focus(), 50);
    aiScrollToBottom();
  }
}

/* ============================================================
   INIT
   ============================================================ */
(function aiInit() {
  aiHistory = aiLoadJSON(AI_CHAT_KEY, []);
  aiApplyTheme();
  aiRenderMessages();
})();
(async () => {
  const alreadySent = sessionStorage.getItem("visit_sent");

  if (alreadySent) return;

  sessionStorage.setItem("visit_sent", "true");

  try {
    await fetch("/api/notify-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        browser: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
      }),
    });
  } catch (err) {
    console.error("Visit notification failed", err);
  }

  // NOTE: a direct-from-browser Google Sheets write used to live here
  // too (type: "visitor"), sent in *addition* to the /api/notify-visit
  // call above. api/notify-visit.js already forwards every visit to
  // the same Apps Script URL server-side (see its own comment there),
  // so this second write was logging every single visit TWICE —
  // inflating Visitors count, "today's visitors" and "online now" in
  // the admin dashboard by roughly 2x. Removed; /api/notify-visit is
  // the single source of truth for visitor logging now.

})();

/* ============================================================
   PIXEL AI — real AI-backed layer (added on top of the offline
   assistant above; nothing above this block was modified in a way
   that changes its behavior for existing features).
   ------------------------------------------------------------
   Talks ONLY to this project's own backend, /api/ai — never to any
   AI provider directly, and never with an API key in the browser.
   See api/ai.js and api/_lib/aiProvider.js.

   COST CONTROL (see also the comments at the top of api/ai.js):
     - "chat" is only ever requested from aiSendMessage() above when
       the free, offline, keyword-matched assistant (AI_KB) found no
       confident match for the player's message.
     - "greeting" is requested AT MOST ONCE PER PLAYER PER CALENDAR
       DAY. The result is cached on the user record
       (user.aiGreetingCache = { date, text }) and reused for any
       further logins/refreshes/panel-opens that same day — see
       pixelAIMaybeFetchDailyGreeting.
     - A short client-side cooldown (PIXEL_AI_MIN_CALL_GAP_MS) plus a
       busy-flag additionally prevent rapid repeat calls; api/ai.js
       also rate-limits per identifier server-side as a backstop.
   ============================================================ */

const PIXEL_AI_ENDPOINT = "/api/ai";
const PIXEL_AI_MIN_CALL_GAP_MS = 4000;
let pixelAILastCallAt = 0;
let pixelAIConfigured = null; // null = not checked yet, else true/false
let pixelAIBusy = false;
let pixelAIPendingGreeting = null;

/* ---- low-level call wrapper ---- */
async function pixelAICall(action, payload) {
  pixelAILastCallAt = Date.now();
  const res = await fetch(PIXEL_AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ action }, payload)),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {}
  if (!res.ok || !data || !data.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
    err.code = data && data.error;
    throw err;
  }
  return data;
}

/* ---- check once (on page load) whether Pixel AI is configured on
   the server at all, so we can skip pointless calls/UI states if the
   site owner hasn't added AI_API_KEY yet. The offline assistant works
   fully either way. ---- */
(function pixelAICheckConfig() {
  fetch(`${PIXEL_AI_ENDPOINT}?action=config`)
    .then((r) => r.json())
    .then((d) => {
      pixelAIConfigured = !!(d && d.ok && d.configured);
    })
    .catch(() => {
      pixelAIConfigured = false;
    });
})();

/* ============================================================
   CONTEXT BUILDER
   ------------------------------------------------------------
   Whitelisted, minimal context only — see the field list below.
   NEVER includes password, gmail/session identifiers, wallet/topup
   history, or anything not needed to answer gaming questions.
   ============================================================ */
function pixelAIContext(user, extra) {
  if (!user) return extra || {};

  const library = (user.library || [])
    .map((id) => {
      const g = CATALOG.find((x) => x.id === id);
      return g ? { title: g.title, genre: g.tag } : null;
    })
    .filter(Boolean);

  const wishlist = (user.wishlist || [])
    .map((id) => {
      const g = CATALOG.find((x) => x.id === id);
      return g ? g.title : null;
    })
    .filter(Boolean);

  const favorites = (user.favorites || [])
    .map((id) => {
      const g = CATALOG.find((x) => x.id === id);
      return g ? g.title : null;
    })
    .filter(Boolean);

  const recentlyPlayed = (user.recentActivity || [])
    .slice(0, 6)
    .map((a) => ({ title: a.title }));

  const catalog = CATALOG.map((g) => ({
    title: g.title,
    genre: g.tag,
    price: g.price,
  }));

  const last = user.lastDailyBonusAt;
  const dailyBonusReady = !last || Date.now() - last >= DAILY_BONUS_COOLDOWN_MS;

  const ctx = {
    nickname: user.nickname || "Player",
    coins: user.coins || 0,
    premium: !!user.premium,
    dailyBonusReady,
    library,
    wishlist,
    favorites,
    recentlyPlayed,
    catalog,
  };
  if (extra) Object.assign(ctx, extra);
  return ctx;
}

/* ============================================================
   VISIT INSIGHT — plain JS, ZERO AI calls. Computes whether this
   is a notable visit ("haven't seen you in a while" / "you're a
   regular now") purely from local data already on the account.
   ============================================================ */
function pixelAIVisitInsight(user) {
  const MS_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const prevSeen = user.lastSeenAt;

  if (!prevSeen) {
    // No prior recorded visit (new account, or account created before
    // this feature existed) — nothing to compare against yet.
    return { isNew: true, days: 0, frequent: false, message: null };
  }

  const days = Math.floor((now - prevSeen) / MS_DAY);
  let message = null;
  let frequent = false;

  if (days >= 3) {
    message = `🎮 Welcome back! You haven't visited Pixel&Games for ${days} day${days === 1 ? "" : "s"}. Good to see you again 👀`;
  } else if (days === 0) {
    const key = activityDateKey();
    const todayLogins =
      (user.dailyActivity && user.dailyActivity[key] && user.dailyActivity[key].logins) || 0;
    if (todayLogins >= 3) {
      frequent = true;
      message = "🔥 Back again? Looks like Pixel&Games is becoming your second home.";
    }
  }

  return { isNew: false, days, frequent, message };
}

/* ============================================================
   PER-VISIT ENTRY POINT — called once from enterApp()
   ============================================================ */
function pixelAIHandleVisit(user) {
  const insight = pixelAIVisitInsight(user);

  // Record this visit AFTER reading the previous lastSeenAt above,
  // so "days since previous visit" is computed correctly.
  persistCurrentUser((uu) => {
    uu.lastSeenAt = Date.now();
  });

  if (insight.message) toast(insight.message);

  pixelAIMaybeFetchDailyGreeting(user, insight);
}

/* ============================================================
   DAILY-CACHED AI GREETING
   ------------------------------------------------------------
   Requests a real AI-generated personalized message AT MOST ONCE
   PER CALENDAR DAY per account. Every other visit that day reuses
   the cached text — no new API call, no new cost.
   ============================================================ */
function pixelAIMaybeFetchDailyGreeting(user, insight) {
  if (!user) return;
  const todayKey = activityDateKey();
  const cache = user.aiGreetingCache;

  if (cache && cache.date === todayKey && cache.text) {
    pixelAIPendingGreeting = cache.text;
    return;
  }

  // Only bother with a real AI call when there's something notable to
  // say — a brand-new player, a real absence, or a frequent-visitor
  // streak. An ordinary, unremarkable same-day reopen doesn't need one.
  if (!insight.isNew && !insight.message) return;
  if (pixelAIConfigured === false) return; // known not configured — skip silently

  const context = pixelAIContext(user, {
    daysSinceVisit: insight.days,
    frequentVisitor: insight.frequent,
  });

  pixelAICall("greeting", {
    identifier: user.gmail || user.nickname || "guest",
    context,
  })
    .then((data) => {
      const text = data.reply;
      persistCurrentUser((uu) => {
        uu.aiGreetingCache = { date: todayKey, text };
      });
      pixelAIPendingGreeting = text;
    })
    .catch((err) => {
      // Silent by design — the free JS-computed toast (if any) already
      // greeted the player; a failed/unconfigured AI call isn't worth
      // surfacing as an error.
      console.warn("Pixel AI greeting unavailable:", err.message || err);
    });
}

/* ============================================================
   REAL AI CHAT — only called from aiSendMessage() above when the
   offline keyword-matched assistant has no confident answer.
   ============================================================ */
function pixelAIAskChat(text) {
  if (pixelAIBusy) {
    aiRespondWithDelay("Still thinking about your last question — one sec! 🤔");
    return;
  }
  if (pixelAIConfigured === false) {
    aiRespondWithDelay(aiFallbackText());
    return;
  }

  pixelAIBusy = true;
  aiShowTyping();

  const user = currentUser();
  const context = pixelAIContext(user);
  const history = aiHistory.slice(-8).map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    text: m.text,
  }));

  pixelAICall("chat", {
    identifier: user ? user.gmail || user.nickname : "guest",
    message: text,
    context,
    history,
  })
    .then((data) => {
      aiHideTyping();
      aiAddMessage("bot", data.reply);
    })
    .catch((err) => {
      aiHideTyping();
      if (err.code === "rate_limited") {
        aiAddMessage(
          "bot",
          "I'm getting a lot of questions at once — give me a few seconds and try again. ⏳",
        );
      } else {
        aiAddMessage("bot", aiFallbackText());
      }
    })
    .finally(() => {
      pixelAIBusy = false;
    });
}

/* ============================================================
   QUICK ACTIONS — the 4 buttons in the Pixel AI panel.
   "My library" and "What's new?" stay 100% offline/deterministic
   (zero AI cost, zero hallucination risk on prices/availability).
   "Recommend a game" and the Coins question route through the
   normal aiSendMessage() flow — Coins is answered by the free
   offline KB topic above; recommendations need real personalization
   so they reach Pixel AI.
   ============================================================ */
function pixelAIQuickAction(type) {
  if (type === "recommend") {
    aiAddMessage("user", "Recommend a game for me.");
    pixelAIAskChat("Recommend a game for me, and briefly explain why.");
    return;
  }
  if (type === "coins") {
    aiAddMessage("user", "How can I earn more Coins?");
    const offline = aiPickResponse("how can i earn more coins");
    aiRespondWithDelay(offline || aiFallbackText());
    return;
  }
  if (type === "library") {
    aiAddMessage("user", "My library");
    aiGoTo("library", "your Library");
    return;
  }
  if (type === "whatsnew") {
    aiAddMessage("user", "What's new?");
    if (typeof CATALOG !== "undefined") {
      const list = CATALOG.map(
        (g) =>
          `• ${g.title} — ${g.tag}${g.price > 0 ? ` — $${g.price.toFixed(2)}` : " — FREE"}`,
      ).join("\n");
      aiRespondWithDelay(
        "Pixel&Games doesn't track individual release dates yet, but here's everything currently in the Store:\n" +
          list,
      );
    } else {
      aiRespondWithDelay(
        "I couldn't reach the game catalog just now — try opening the Store directly.",
      );
    }
    return;
  }
}