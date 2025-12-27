const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Data copied from seed_products.js
const productsData = [
    {
        title: "FerroFlav",
        ingredients: "حديد (فيروس جلوكونات)، هيدروكلوريد الليسين، فيتامين ب1 (ثيامين)، فيتامين ب6 (بيريدوكسين)، فيتامين ب12 (سيانوكوبالامين).",
        usage_instructions: "الأطفال من 2-6 سنوات: ملعقة صغيرة يومياً. الأطفال أكبر من 6 سنوات: 2 ملعقة صغيرة يومياً. يرج جيداً قبل الاستخدام.",
        indications: "علاج والوقاية من أنيميا نقص الحديد، فقدان الشهية عند الأطفال، مقوي عام للجسم. بطعم الكريز المحبب للأطفال.",
        side_effects: "قد يحدث اضطراب بسيط في المعدة، إمساك، أو تغير لون البراز للداكن (أعراض مؤقتة).",
        age_range: "الأطفال من عمر سنتين",
        warning: "يحفظ بعيداً عن متناول الأطفال. لا تتجاوز الجرعة المقررة."
    },
    {
        title: "Flexolyte",
        ingredients: "كلوريد الصوديوم، كلوريد البوتاسيوم، سترات الصوديوم، دكستروز (جلوكوز)، زنك. (تركيبة منخفضة الأسمولية)",
        usage_instructions: "يستخدم تحت إشراف الطبيب. عموماً يعطى بكميات صغيرة وبشكل متكرر لتعويض السوائل المفقودة.",
        indications: "محلول معالجة الجفاف للوقاية والعلاج من الجفاف الناتج عن الإسهال والقيء والنزلات المعوية.",
        side_effects: "نادراً ما يحدث غثيان أو قيء إذا تم تناوله بسرعة كبيرة.",
        age_range: "آمن من عمر يوم (الرضع والأطفال)",
        warning: "تخلص من أي كمية متبقية بعد 24 ساعة من فتح العبوة."
    },
    {
        title: "Kedonosh",
        ingredients: "كبريتات الزنك، أملاح تعويضية، جلوكوز.",
        usage_instructions: "يعطى ببطء وبشكل متكرر. للرضع: 1-2 ملعقة صغيرة كل بضعة دقائق.",
        indications: "علاج الجفاف، تعويض الزنك أثناء الإسهال لتقليل حدة وفترة المرض.",
        side_effects: "غثيان بسيط (خاصة لو أخذ على معدة فارغة).",
        age_range: "من عمر يوم",
        warning: "استشر الطبيب إذا استمر الإسهال لأكثر من 24 ساعة."
    },
    {
        title: "Bee-Potassium",
        ingredients: "سترات البوتاسيوم 200 مجم / 5 مل.",
        usage_instructions: "حسب وصفة الطبيب بناءً على تحليل نسبة البوتاسيوم في الدم.",
        indications: "علاج نقص البوتاسيوم (Hypokalemia)، الوقاية من حصوات الكلى.",
        side_effects: "اضطراب بالمعدلة، غثيان. يفضل تناوله مع الطعام لتقليل تهيج المعدة.",
        age_range: "الأطفال والبالغين",
        warning: "يستخدم بحذر شديد مع مرضى القصور الكلوي."
    },
    {
        title: "Bee Vita",
        ingredients: "فيتامين أ، فيتامين د3، فيتامين هـ، فيتامين سي، مجموعة فيتامين ب.",
        usage_instructions: "الرضع (0-1 سنة): 1 مل يومياً. الأطفال (1-4 سنوات): 2.5 مل يومياً.",
        indications: "علاج نقص الفيتامينات، دعم النمو الصحي، تعزيز المناعة.",
        side_effects: "لا توجد أعراض جانبية عند الالتزام بالجرعة.",
        age_range: "الرضع حتى 4 سنوات",
        warning: "لا يستخدم بالتزامن مع مكملات أخرى تحتوي على فيتامين أ أو د."
    },
    {
        title: "Flamogest",
        ingredients: "تربسين، كيموتربسين، بروميلين، باباين، سيرابيتاز، روتين.",
        usage_instructions: "قرص أو قرصين 3 مرات يومياً، قبل الأكل بـ 30 دقيقة.",
        indications: "علاج التورم والالتهابات الناتجة عن الكدمات، العمليات الجراحية، أو العدوى. مسكن للألم.",
        side_effects: "نادراً ما يحدث حساسية أو اضطراب معدي بسيط.",
        age_range: "البالغين",
        warning: "يمنع استخدامه لمن يعانون من سيولة الدم أو مشاكل التجلط."
    },
    {
        title: "Vita-DE-Val",
        ingredients: "فيتامين د3 (كوليكالسيفيرول) تركيزات 1000 و 5000 وحدة دولية.",
        usage_instructions: "كبسولة واحدة يومياً مع وجبة دسمة، أو حسب إرشادات الطبيب.",
        indications: "علاج نقص فيتامين د، هشاشة العظام، تعزيز المناعة.",
        side_effects: "لا توجد أعراض جانبية بالجرعات العادية.",
        age_range: "البالغين والمراهقين",
        warning: "ينصح بعمل تحليل فيتامين د بشكل دوري."
    },
    {
        title: "Arthojo",
        ingredients: "جلوكوزامين، كوندرويتين، إم إس إم (MSM)، فيتامين سي، مستخلص الكركم.",
        usage_instructions: "قرص مرتين يومياً وسط الأكل.",
        indications: "خشونة المفاصل، آلام الظهر والمفاصل، الحفاظ على الغضاريف.",
        side_effects: "حرقة بسيطة بالمعدة أحياناً.",
        age_range: "البالغين",
        warning: "استشر الطبيب لو مريض سكر أو بتاخد أدوية سيولة."
    },
    {
        title: "Bee Carbone",
        ingredients: "فحم نشط، زيت يانسون، زيت نعناع.",
        usage_instructions: "1-2 قرص بعد الأكل عند اللزوم (بحد أقصى 3 مرات يومياً).",
        indications: "الانتفاخ، الغازات، عسر الهضم، القولون العصبي.",
        side_effects: "تلون البراز باللون الأسود (غير مقلق).",
        age_range: "البالغين والأطفال > 12 سنة",
        warning: "يفصل بساعتين عن أي دواء آخر لأن الفحم قد يقلل امتصاص الأدوية."
    },
    {
        title: "Bee- Lactase",
        ingredients: "إنزيم لاكتيز 9000 وحدة.",
        usage_instructions: "قرص واحد مباشرة قبل تناول أي وجبة دسمة أو منتجات ألبان.",
        indications: "عدم تحمل اللاكتوز (Lactose Intolerance)، الانتفاخ والقولون بعد شرب اللبن.",
        side_effects: "آمن تماماً.",
        age_range: "البالغين والأطفال",
        warning: "إذا استمرت الأعراض استشر الطبيب."
    },
    {
        title: "Reboton Gel",
        ingredients: "بانثينول، صبار (Aloe Vera)، مستخلص الآذريون (Calendula)، عسل، زيت شجرة الشاي.",
        usage_instructions: "دهان طبقة رقيقة على المكان المصاب 2-3 مرات يومياً.",
        indications: "حروق الشمس، الحروق البسيطة، الجروح السطحية، تشققات الجلد، جفاف البشرة.",
        side_effects: "نادر جداً حدوث حساسية جلدية.",
        age_range: "آمن لجميع الأعمار",
        warning: "للاستخدام الخارجي فقط. تجنب ملامسة العين."
    },
    {
        title: "Emax cream",
        ingredients: "منثول، زيت كافور، ميثيل ساليسيلات، مستخلص الفلفل الحار (Capsicum).",
        usage_instructions: "تدليك برفق على مكان الألم حتى الامتصاص. يكرر 3-4 مرات يومياً.",
        indications: "آلام العضلات، آلام الظهر، الروماتيزم، الكدمات، التواء المفاصل.",
        side_effects: "احمرار بسيط أو شعور بالسخونة مكان الدهان.",
        age_range: "البالغين والأطفال > 6 سنوات",
        warning: "لا يوضع على جرح مفتوح أو الوجه."
    },
    {
        title: "Alovenol",
        ingredients: "مستخلص الصبار، بانثينول، فيتامين هـ، زيت الروزماري، زيت الجوجوبا.",
        usage_instructions: "رش/وضع كمية مناسبة على فروة الرأس مع التدليك لمدة دقيقتين. يستخدم مرتين يومياً.",
        indications: "تساقط الشعر، الشعر الضعيف والمتقصف، جفاف فروة الرأس.",
        side_effects: "آمن تماماً.",
        age_range: "البالغين",
        warning: "للاستخدام الخارجي فقط."
    },
    {
        title: "k Val",
        ingredients: "حمض الساليسيليك، زيت شجرة الشاي، أكسيد الزنك، نياسيناميد.",
        usage_instructions: "يوضع كمية صغيرة على مناطق الحبوب مرتين يومياً بعد الغسيل.",
        indications: "حب الشباب، البشرة الدهنية، الرؤوس السوداء والبيضاء.",
        side_effects: "قد يسبب جفاف بسيط للبشرة في بداية الاستخدام.",
        age_range: "المراهقين والبالغين",
        warning: "تجنب التعرض المباشر للشمس بعد وضعه."
    },
    {
        title: "Emax gel",
        ingredients: "منثول، كافور، مستخلص أرنيكا.",
        usage_instructions: "يوضع على مكان الإصابة لتقليل الورم والألم فوراً.",
        indications: "الكدمات، الورم، إصابات الملاعب، الشد العضلي الحاد.",
        side_effects: "لا يوجد.",
        age_range: "البالغين والأطفال > 6 سنوات",
        warning: "لا تستخدم كمادات ساخنة معه مباشرة."
    },
    {
        title: "Eucament",
        ingredients: "زيت الكافور، منثول، ميثيل ساليسيلات.",
        usage_instructions: "دهان موضعي 2-3 مرات يومياً.",
        indications: "آلام الروماتيزم، خشونة المفاصل، آلام الرقبة والظهر.",
        side_effects: "حساسية موضعية نادرة.",
        age_range: "البالغين",
        warning: "غسل اليدين جيداً بعد الاستخدام."
    },
    {
        title: "Compo Bee",
        ingredients: "عكبر (Propolis)، عسل نحل، بانثينول، كاموميل.",
        usage_instructions: "دهان طبقة كثيفة على المنطقة المصابة.",
        indications: "التهابات الحفاضات، التسلخات، لدغات الحشرات، الاكزيما البسيطة.",
        side_effects: "آمن جداً.",
        age_range: "آمن للرضع والأطفال",
        warning: "اختبر كمية صغيرة لو عندك حساسية من منتجات العسل."
    },
    {
        title: "Emax Spray",
        ingredients: "منثول، ميثيل ساليسيلات، كافور، قاعدة كحولية.",
        usage_instructions: "رش 2-3 بخات على مكان الألم من مسافة 15 سم.",
        indications: "آلام الظهر، الشد العضلي أثناء التمرين، آلام المفاصل.",
        side_effects: "لسعة برودة مؤقتة.",
        age_range: "البالغين والمراهقين",
        warning: "سريع الاشتعال. لا ترش قرب العين."
    },
    {
        title: "Palmetol",
        ingredients: "مستخلص الساو بالميتو (Saw Palmetto)، كافيين، بيوتين، مستخلص الجينسينج.",
        usage_instructions: "6 بخات على فروة الرأس صباحاً ومساءً مع التدليك.",
        indications: "الصلع الوراثي، فراغات الشعر، ترقق الشعر.",
        side_effects: "آمن ولا يسبب أعراض انسحابية.",
        age_range: "البالغين",
        warning: "للاستخدام الخارجي فقط."
    }
];

async function restoreData() {
    try {
        console.log("🚀 Restoring product data (Ingredients, Indications, etc.)...");

        for (const prod of productsData) {
            const res = await pool.query(
                `UPDATE products 
                 SET ingredients = $1, usage_instructions = $2, indications = $3, side_effects = $4, age_range = $5, warning = $6
                 WHERE title = $7`,
                [
                    prod.ingredients,
                    prod.usage_instructions,
                    prod.indications,
                    prod.side_effects,
                    prod.age_range,
                    prod.warning,
                    prod.title
                ]
            );

            if (res.rowCount > 0) {
                console.log(`✅ Updated: ${prod.title}`);
            } else {
                console.log(`⚠️ Product not found: ${prod.title}`);
            }
        }

        console.log("🏁 Data restoration complete!");
    } catch (err) {
        console.error("❌ DB Error:", err);
    } finally {
        await pool.end();
    }
}

restoreData();
