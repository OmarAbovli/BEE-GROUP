require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const categoriesData = [
    { name: 'شراب (Syrups)', description: 'Liquid supplements and medicines including syrups and sachets' },
    { name: 'أقراص (Tablets)', description: 'Tablets and capsules for various treatments' },
    { name: 'دهانات (Creams & Gels)', description: 'Topical creams, gels, and lotions for external use' },
    { name: 'بخاخ (Sprays)', description: 'Sprays for hair and topical use' }
];

const productsData = [
    {
        title: "FerroFlav",
        title_en: "FerroFlav",
        description: "تركيبة مميزة تجمع بين الحديد والليسين لتحفيز شهية الأطفال والوقاية من فقر الدم الناتج عن نقص الحديد. مدعم بمجموعة من الفيتامينات.",
        description_en: "A unique formula combining Iron and Lysine to stimulate children's appetite and prevent iron deficiency anemia. Fortified with vitamins.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/FerroFlav.jpg",
        category: "شراب (Syrups)",
        ingredients: "حديد (فيروس جلوكونات)، هيدروكلوريد الليسين، فيتامين ب1 (ثيامين)، فيتامين ب6 (بيريدوكسين)، فيتامين ب12 (سيانوكوبالامين).",
        ingredients_en: "Iron (Ferrous Gluconate), Lysine Hydrochloride, Vitamin B1, Vitamin B6, Vitamin B12.",
        usage_instructions: "الأطفال من 2-6 سنوات: ملعقة صغيرة يومياً. الأطفال أكبر من 6 سنوات: 2 ملعقة صغيرة يومياً. يرج جيداً قبل الاستخدام.",
        usage_instructions_en: "Children 2-6 years: 1 tsp daily. Children > 6 years: 2 tsp daily. Shake well before use.",
        indications: "علاج والوقاية من أنيميا نقص الحديد، فقدان الشهية عند الأطفال، مقوي عام للجسم. بطعم الكريز المحبب للأطفال.",
        indications_en: "Treatment and prevention of iron deficiency anemia, loss of appetite, general tonic. Cherry flavor.",
        side_effects: "قد يحدث اضطراب بسيط في المعدة، إمساك، أو تغير لون البراز للداكن (أعراض مؤقتة).",
        side_effects_en: "Mild stomach upset, constipation, or dark stool (temporary).",
        age_range: "الأطفال من عمر سنتين",
        age_range_en: "Children from 2 years",
        is_prescription: "false",
        warning: "يحفظ بعيداً عن متناول الأطفال. لا تتجاوز الجرعة المقررة.",
        warning_en: "Keep out of reach of children. Do not exceed recommended dose."
    },
    {
        title: "Flexolyte",
        title_en: "Flexolyte",
        description: "أول محلول معالجة جفاف جاهز للاستخدام بتركيز أسمولية منخفض. آمن للاستخدام من اليوم الأول. متوفر بـ 7 أطعمة مختلفة.",
        description_en: "First ready-to-use ORS with low osmolarity. Safe from day one. Available in 7 flavors.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Flexolyte.jpg",
        category: "شراب (Syrups)",
        ingredients: "كلوريد الصوديوم، كلوريد البوتاسيوم، سترات الصوديوم، دكستروز (جلوكوز)، زنك. (تركيبة منخفضة الأسمولية)",
        ingredients_en: "Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose, Zinc (Low Osmolarity Formula).",
        usage_instructions: "يستخدم تحت إشراف الطبيب. عموماً يعطى بكميات صغيرة وبشكل متكرر لتعويض السوائل المفقودة.",
        usage_instructions_en: "Use under medical supervision. Give in small, frequent amounts to replace lost fluids.",
        indications: "محلول معالجة الجفاف للوقاية والعلاج من الجفاف الناتج عن الإسهال والقيء والنزلات المعوية.",
        indications_en: "ORS for prevention and treatment of dehydration due to diarrhea and vomiting.",
        side_effects: "نادراً ما يحدث غثيان أو قيء إذا تم تناوله بسرعة كبيرة.",
        side_effects_en: "Rarely nausea or vomiting if consumed too quickly.",
        age_range: "آمن من عمر يوم (الرضع والأطفال)",
        age_range_en: "Safe from day one (Infants & Children)",
        is_prescription: "false",
        warning: "تخلص من أي كمية متبقية بعد 24 ساعة من فتح العبوة.",
        warning_en: "Discard any remaining amount 24 hours after opening."
    },
    {
        title: "Kedonosh",
        description: "محلول معالجة جفاف مدعم بالزنك، آمن للأطفال من عمر يوم، متوفر بـ 3 أطعمة لسهولة التقبل.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Kedonosh.jpg",
        category: "شراب (Syrups)",
        ingredients: "كبريتات الزنك، أملاح تعويضية، جلوكوز.",
        usage_instructions: "يعطى ببطء وبشكل متكرر. للرضع: 1-2 ملعقة صغيرة كل بضعة دقائق.",
        indications: "علاج الجفاف، تعويض الزنك أثناء الإسهال لتقليل حدة وفترة المرض.",
        side_effects: "غثيان بسيط (خاصة لو أخذ على معدة فارغة).",
        age_range: "من عمر يوم",
        is_prescription: "false",
        warning: "استشر الطبيب إذا استمر الإسهال لأكثر من 24 ساعة."
    },
    {
        title: "Bee-Potassium",
        description: "شراب سترات البوتاسيوم بتركيز 200 مجم بطعم البرتقال. مكمل غذائي لمرضى العناية المركزة والأطفال لضبط توازن الأملاح.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761483339_Be-Potassium.jpg",
        category: "شراب (Syrups)",
        ingredients: "سترات البوتاسيوم 200 مجم / 5 مل.",
        usage_instructions: "حسب وصفة الطبيب بناءً على تحليل نسبة البوتاسيوم في الدم.",
        indications: "علاج نقص البوتاسيوم (Hypokalemia)، الوقاية من حصوات الكلى.",
        side_effects: "اضطراب بالمعدلة، غثيان. يفضل تناوله مع الطعام لتقليل تهيج المعدة.",
        age_range: "الأطفال والبالغين",
        is_prescription: "true",
        warning: "يستخدم بحذر شديد مع مرضى القصور الكلوي."
    },
    {
        title: "Bee Vita",
        description: "بي-فيتا مكمل غذائي متعدد الفيتامينات مصمم خصيصاً للرضع والأطفال حتى 4 سنوات لدعم النمو والمناعة.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761484148_Bee Vita.jpg",
        category: "شراب (Syrups)",
        ingredients: "فيتامين أ، فيتامين د3، فيتامين هـ، فيتامين سي، مجموعة فيتامين ب.",
        usage_instructions: "الرضع (0-1 سنة): 1 مل يومياً. الأطفال (1-4 سنوات): 2.5 مل يومياً.",
        indications: "علاج نقص الفيتامينات، دعم النمو الصحي، تعزيز المناعة.",
        side_effects: "لا توجد أعراض جانبية عند الالتزام بالجرعة.",
        age_range: "الرضع حتى 4 سنوات",
        is_prescription: "false",
        warning: "لا يستخدم بالتزامن مع مكملات أخرى تحتوي على فيتامين أ أو د."
    },
    {
        title: "Flamogest",
        description: "تركيبة فريدة من 6 إنزيمات محللة للبروتين، توفر تأثيراً قوياً مضاداً للالتهابات ومسكناً للألم.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Flamogest.jpg",
        category: "أقراص (Tablets)",
        ingredients: "تربسين، كيموتربسين، بروميلين، باباين، سيرابيتاز، روتين.",
        usage_instructions: "قرص أو قرصين 3 مرات يومياً، قبل الأكل بـ 30 دقيقة.",
        indications: "علاج التورم والالتهابات الناتجة عن الكدمات، العمليات الجراحية، أو العدوى. مسكن للألم.",
        side_effects: "نادراً ما يحدث حساسية أو اضطراب معدي بسيط.",
        age_range: "البالغين",
        is_prescription: "false",
        warning: "يمنع استخدامه لمن يعانون من سيولة الدم أو مشاكل التجلط."
    },
    {
        title: "Vita-DE-Val",
        description: "كبسولات فيتامين د3 جلاتينية عالية الجودة، مصممة لدعم الصحة العامة وتقوية العظام والمناعة.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Vita-DE-Val.jpg",
        category: "أقراص (Tablets)",
        ingredients: "فيتامين د3 (كوليكالسيفيرول) تركيزات 1000 و 5000 وحدة دولية.",
        usage_instructions: "كبسولة واحدة يومياً مع وجبة دسمة، أو حسب إرشادات الطبيب.",
        indications: "علاج نقص فيتامين د، هشاشة العظام، تعزيز المناعة.",
        side_effects: "لا توجد أعراض جانبية بالجرعات العادية.",
        age_range: "البالغين والمراهقين",
        is_prescription: "false",
        warning: "ينصح بعمل تحليل فيتامين د بشكل دوري."
    },
    {
        title: "Arthojo",
        description: "تركيبة متطورة من المستخلصات الطبيعية والفيتامينات لدعم صحة المفاصل وتحسين الحركة وعلاج الخشونة.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Arthojo.jpg",
        category: "أقراص (Tablets)",
        ingredients: "جلوكوزامين، كوندرويتين، إم إس إم (MSM)، فيتامين سي، مستخلص الكركم.",
        usage_instructions: "قرص مرتين يومياً وسط الأكل.",
        indications: "خشونة المفاصل، آلام الظهر والمفاصل، الحفاظ على الغضاريف.",
        side_effects: "حرقة بسيطة بالمعدة أحياناً.",
        age_range: "البالغين",
        is_prescription: "false",
        warning: "استشر الطبيب لو مريض سكر أو بتاخد أدوية سيولة."
    },
    {
        title: "Bee Carbone",
        description: "مكمل غذائي يحتوي على الفحم النشط وزيت اليانسون والنعناع. طارد قوي للغازات وعلاج للانتفاخ.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761484160_Bee Carbon.jpg",
        category: "أقراص (Tablets)",
        ingredients: "فحم نشط، زيت يانسون، زيت نعناع.",
        usage_instructions: "1-2 قرص بعد الأكل عند اللزوم (بحد أقصى 3 مرات يومياً).",
        indications: "الانتفاخ، الغازات، عسر الهضم، القولون العصبي.",
        side_effects: "تلون البراز باللون الأسود (غير مقلق).",
        age_range: "البالغين والأطفال > 12 سنة",
        is_prescription: "false",
        warning: "يفصل بساعتين عن أي دواء آخر لأن الفحم قد يقلل امتصاص الأدوية."
    },
    {
        title: "Bee- Lactase",
        description: "إنزيم اللاكتيز الهاضم للاكتوز، يساعد على هضم منتجات الألبان بدون مشاكل.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761484464_Bee Lactase.jpg",
        category: "أقراص (Tablets)",
        ingredients: "إنزيم لاكتيز 9000 وحدة.",
        usage_instructions: "قرص واحد مباشرة قبل تناول أي وجبة دسمة أو منتجات ألبان.",
        indications: "عدم تحمل اللاكتوز (Lactose Intolerance)، الانتفاخ والقولون بعد شرب اللبن.",
        side_effects: "آمن تماماً.",
        age_range: "البالغين والأطفال",
        is_prescription: "false",
        warning: "إذا استمرت الأعراض استشر الطبيب."
    },
    {
        title: "Reboton Gel",
        description: "أكثر من مجرد مرطب.. جل علاجي يسرع التئام الجروح والحروق، بتركيبة طبيعية متطورة.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Reboton%20Gel.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "بانثينول، صبار (Aloe Vera)، مستخلص الآذريون (Calendula)، عسل، زيت شجرة الشاي.",
        usage_instructions: "دهان طبقة رقيقة على المكان المصاب 2-3 مرات يومياً.",
        indications: "حروق الشمس، الحروق البسيطة، الجروح السطحية، تشققات الجلد، جفاف البشرة.",
        side_effects: "نادر جداً حدوث حساسية جلدية.",
        age_range: "آمن لجميع الأعمار",
        is_prescription: "false",
        warning: "للاستخدام الخارجي فقط. تجنب ملامسة العين."
    },
    {
        title: "Emax cream",
        description: "كريم مساج متطور بتركيبة (حار وبارد)، خليط عشبي وفعال لتسكين آلام العضلات والمفاصل بسرعة.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20cream.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "منثول، زيت كافور، ميثيل ساليسيلات، مستخلص الفلفل الحار (Capsicum).",
        usage_instructions: "تدليك برفق على مكان الألم حتى الامتصاص. يكرر 3-4 مرات يومياً.",
        indications: "آلام العضلات، آلام الظهر، الروماتيزم، الكدمات، التواء المفاصل.",
        side_effects: "احمرار بسيط أو شعور بالسخونة مكان الدهان.",
        age_range: "البالغين والأطفال > 6 سنوات",
        is_prescription: "false",
        warning: "لا يوضع على جرح مفتوح أو الوجه."
    },
    {
        title: "Alovenol",
        description: "لوشن للشعر بتركيبة غنية لتغذية فروة الرأس، تقوية بصيلات الشعر ومنع التساقط.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Alovenol.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "مستخلص الصبار، بانثينول، فيتامين هـ، زيت الروزماري، زيت الجوجوبا.",
        usage_instructions: "رش/وضع كمية مناسبة على فروة الرأس مع التدليك لمدة دقيقتين. يستخدم مرتين يومياً.",
        indications: "تساقط الشعر، الشعر الضعيف والمتقصف، جفاف فروة الرأس.",
        side_effects: "آمن تماماً.",
        age_range: "البالغين",
        is_prescription: "false",
        warning: "للاستخدام الخارجي فقط."
    },
    {
        title: "k Val",
        description: "جل مخصص للبشرة المعرضة للحبوب، ينظف المسام ويقلل الإفرازات الدهنية ويزيل الرؤوس السوداء.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/k%20Val.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "حمض الساليسيليك، زيت شجرة الشاي، أكسيد الزنك، نياسيناميد.",
        usage_instructions: "يوضع كمية صغيرة على مناطق الحبوب مرتين يومياً بعد الغسيل.",
        indications: "حب الشباب، البشرة الدهنية، الرؤوس السوداء والبيضاء.",
        side_effects: "قد يسبب جفاف بسيط للبشرة في بداية الاستخدام.",
        age_range: "المراهقين والبالغين",
        is_prescription: "false",
        warning: "تجنب التعرض المباشر للشمس بعد وضعه."
    },
    {
        title: "Emax gel",
        description: "جل مساج بتركيبة باردة (Cooling)، سريع الامتصاص لعلاج الكدمات وإصابات الملاعب.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20gel.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "منثول، كافور، مستخلص أرنيكا.",
        usage_instructions: "يوضع على مكان الإصابة لتقليل الورم والألم فوراً.",
        indications: "الكدمات، الورم، إصابات الملاعب، الشد العضلي الحاد.",
        side_effects: "لا يوجد.",
        age_range: "البالغين والأطفال > 6 سنوات",
        is_prescription: "false",
        warning: "لا تستخدم كمادات ساخنة معه مباشرة."
    },
    {
        title: "Eucament",
        description: "كريم مسكن ومضاد للروماتيزم، يهدئ آلام العظام والعضلات.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761484266_Eucament.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "زيت الكافور، منثول، ميثيل ساليسيلات.",
        usage_instructions: "دهان موضعي 2-3 مرات يومياً.",
        indications: "آلام الروماتيزم، خشونة المفاصل، آلام الرقبة والظهر.",
        side_effects: "حساسية موضعية نادرة.",
        age_range: "البالغين",
        is_prescription: "false",
        warning: "غسل اليدين جيداً بعد الاستخدام."
    },
    {
        title: "Compo Bee",
        description: "كريم ملطف ومرطب للجلد، بخلاصة العسل والبروبوليس لتهدئة الالتهابات.",
        image_url: "https://beegroup-dashboard.beegroup-eg.com/uploads/product/1761484316_Compo%20bee.jpg",
        category: "دهانات (Creams & Gels)",
        ingredients: "عكبر (Propolis)، عسل نحل، بانثينول، كاموميل.",
        usage_instructions: "دهان طبقة كثيفة على المنطقة المصابة.",
        indications: "التهابات الحفاضات، التسلخات، لدغات الحشرات، الاكزيما البسيطة.",
        side_effects: "آمن جداً.",
        age_range: "آمن للرضع والأطفال",
        is_prescription: "false",
        warning: "اختبر كمية صغيرة لو عندك حساسية من منتجات العسل."
    },
    {
        title: "Emax Spray",
        description: "بخاخ مساج سريع المفعول، نفس قوة الكريم ولكن في صورة سبراي للوصول للأماكن الصعبة.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20Spray.jpg",
        category: "بخاخ (Sprays)",
        ingredients: "منثول، ميثيل ساليسيلات، كافور، قاعدة كحولية.",
        usage_instructions: "رش 2-3 بخات على مكان الألم من مسافة 15 سم.",
        indications: "آلام الظهر، الشد العضلي أثناء التمرين، آلام المفاصل.",
        side_effects: "لسعة برودة مؤقتة.",
        age_range: "البالغين والمراهقين",
        is_prescription: "false",
        warning: "سريع الاشتعال. لا ترش قرب العين."
    },
    {
        title: "Palmetol",
        description: "بخاخ شعر طبيعي لعلاج الصلع الوراثي وتساقط الشعر، يحتوي على الساو بالميتو.",
        image_url: "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Palmetol.jpg",
        category: "بخاخ (Sprays)",
        ingredients: "مستخلص الساو بالميتو (Saw Palmetto)، كافيين، بيوتين، مستخلص الجينسينج.",
        usage_instructions: "6 بخات على فروة الرأس صباحاً ومساءً مع التدليك.",
        indications: "الصلع الوراثي، فراغات الشعر، ترقق الشعر.",
        side_effects: "آمن ولا يسبب أعراض انسحابية.",
        age_range: "البالغين",
        is_prescription: "false",
        warning: "للاستخدام الخارجي فقط."
    }
];

async function seedProducts() {
    await client.connect();
    try {
        // Insert Categories
        for (const cat of categoriesData) {
            const res = await client.query(
                'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
                [cat.name, cat.description]
            );
            const catId = res.rows[0].id;

            // Insert Products for this category
            const catProducts = productsData.filter(p => p.category === cat.name);
            for (const prod of catProducts) {
                await client.query(
                    `INSERT INTO products (
                        title, title_en, description, description_en, image_url, category_id,
                        ingredients, ingredients_en, usage_instructions, usage_instructions_en,
                        indications, indications_en, side_effects, side_effects_en,
                        age_range, age_range_en, is_prescription, warning, warning_en, model_path
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
                    [
                        prod.title,
                        prod.title_en || null,
                        prod.description,
                        prod.description_en || null,
                        prod.image_url,
                        catId,
                        prod.ingredients,
                        prod.ingredients_en || null,
                        prod.usage_instructions,
                        prod.usage_instructions_en || null,
                        prod.indications,
                        prod.indications_en || null,
                        prod.side_effects,
                        prod.side_effects_en || null,
                        prod.age_range,
                        prod.age_range_en || null,
                        prod.is_prescription,
                        prod.warning,
                        prod.warning_en || null,
                        prod.model_path || null
                    ]
                );
            }
        }
        console.log("Products seeded successfully");
    } catch (err) {
        console.error("Error seeding products", err);
    } finally {
        await client.end();
    }
}

seedProducts();
