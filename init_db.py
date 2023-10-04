from app import app, db, Language, Article

# Push an application context
with app.app_context():
    # Create tables
    db.create_all()

    # Sample data for Languages
    languages = [
        Language(code='sv', name='Svenska'),
        Language(code='en', name='English'),
        Language(code='fr', name='Français'),
        Language(code='de', name='Deutsch'),
        Language(code='es', name='Español'),
        Language(code='it', name='Italiano'),
        Language(code='pt', name='Português'),
        Language(code='ru', name='Русский'),
        Language(code='zh', name='中文'),
        Language(code='ja', name='日本語'),
        Language(code='ko', name='한국어'),
        Language(code='ar', name='العربية'),
        Language(code='hi', name='हिंदी'),
        Language(code='bn', name='বাংলা'),
        Language(code='id', name='Bahasa Indonesia'),
        Language(code='ms', name='Bahasa Melayu'),
        Language(code='th', name='ไทย'),
        Language(code='tr', name='Türkçe'),
        Language(code='uk', name='Українська'),
        Language(code='pl', name='Polski'),
        Language(code='nl', name='Nederlands'),
        Language(code='el', name='Ελληνικά'),
        Language(code='he', name='עברית'),
        Language(code='fa', name='فارسی'),
        Language(code='ta', name='தமிழ்'),
        Language(code='te', name='తెలుగు'),
        Language(code='mr', name='मराठी'),
        Language(code='ur', name='اردو'),
        Language(code='vi', name='Tiếng Việt'),
        Language(code='gu', name='ગુજરાતી'),
        Language(code='pa', name='ਪੰਜਾਬੀ'),
        Language(code='ml', name='മലയാളം'),
        Language(code='kn', name='ಕನ್ನಡ'),
        Language(code='or', name='ଓଡିଆ'),
        Language(code='my', name='မြန်မာဘာသာ'),
        Language(code='fi', name='Suomi'),
        Language(code='hu', name='Magyar'),
    ]

    db.session.add_all(languages)

    # Sample content about ISS

    # Sample content about ISS (in Swedish)
    iss_content = ("Internationella rymdstationen, eller ISS (av engelska: International Space Station, "
                           "ryska: Междунаро́дная косми́ческая ста́нция, МКС; Mezjdunarodnaja kosmitjeskaja stantsija, MKS) "
                           "är en rymdstation ägd av USA, Ryssland, Kanada, Japan och ett antal europeiska länder. "
                           "För USA och Ryssland är den en efterföljare till två tidigare rymdstationer: USA:s Skylab och "
                           "det tidigare Sovjetunionens, sedermera Rysslands, Mir. ISS är ett internationellt projekt, och kan "
                           "ses som en symbol för att det kalla kriget, där rymdkapplöpningen spelade en stor roll, är över.\n\n"
                           "Den första modulen sattes i omloppsbana av en rysk Protonraket i november 1998. Sedan den "
                           "2 november 2000 har stationen varit bemannad med minst två personer, och sedan 29 maj 2009 är ISS "
                           "normalt bemannad med sex personer. De första besättningsmännen kallade stationen Alpha, men detta "
                           "namn användes bara under deras uppdrag.")
    article_iss = Article(title='Internationella rymdstationen (ISS)', content=iss_content)

    db.session.add(article_iss)

    # Commit all the changes
    db.session.commit()
