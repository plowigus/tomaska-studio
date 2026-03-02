import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("🚀 Starting database cleanup and seed...");

    // 0. Cleanup existing data
    console.log("🧹 Cleaning up old data...");
    await supabase.from('site_content').delete().neq('section', 'NONE'); // Delete all
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('testimonials').delete().neq('id', 0);
    await supabase.from('offer_steps').delete().neq('step_number', 'NONE');

    // 1. Site Content
    console.log("📝 Seeding site_content...");
    const siteContent = [
        { section: 'hero', key: 'quote', value: '„Tworzę przestrzeń idealną dla klienta, poznając jego osobowość oraz indywidualne potrzeby."' },
        { section: 'about', key: 'paragraph_1', value: 'Jako absolwentka wrocławskiej ASP i założycielka TOMASKA STUDIO, patrzę na architekturę dwutorowo. Fascynują mnie wnętrza budynków, ale kluczem do ich zrozumienia są dla mnie wnętrza ludzi, którzy w nich mieszkają.' },
        { section: 'about', key: 'paragraph_2', value: 'Wierzę, że przestrzeń ma realny wpływ na nasze życie. Dlatego każdy projekt zaczynam od poznania Twoich potrzeb, pasji i stylu bycia. Nie narzucam wizji – łączę Twoje oczekiwania z moim doświadczeniem.' },
        { section: 'about', key: 'paragraph_3', value: 'Tworzę projekty ponadczasowe. Łączę fakturę, kolor i światło z funkcjonalnością. Efekt? Wnętrze, które jest nie tylko inspirujące i piękne, ale przede wszystkim wygodne. To ma być Twój azyl.' },
        { section: 'contact', key: 'designer_name', value: 'Joanna Tomaska' },
        { section: 'contact', key: 'phone', value: '885 469 189' },
        { section: 'contact', key: 'email', value: 'wnetrza@tomaskastudio.pl' },
        { section: 'contact', key: 'heading', value: 'Zostańmy w kontakcie!' },
        { section: 'contact', key: 'description', value: 'Jesteś zainteresowany projektem wnętrza lub chciałbyś dowiedzieć się jak wygląda współpraca z projektantem? Pisz lub dzwoń śmiało! Odpowiem na wszystkie Twoje pytania.' }
    ];

    const { error: contentError } = await supabase.from('site_content').upsert(siteContent, { onConflict: 'section,key' });
    if (contentError) console.error("❌ site_content error:", contentError);
    else console.log("✅ site_content seeded.");

    // 2. Projects
    console.log("🏗️ Seeding projects...");
    const projects = [
        {
            title: 'Elegancja marmuru',
            category: '01',
            description: 'Projekt wnętrza apartamentu w centrum Warszawy, gdzie główną rolę gra szlachetny marmur Calacatta Oro. Przestrzeń została zaprojektowana z myślą o płynnym przenikaniu się stref funkcjonalnych, tworząc spójną, elegancką całość. Zastosowanie naturalnych materiałów – kamienia, drewna dębowego i lnu – nadaje wnętrzu ciepła, mimo jego luksusowego charakteru.',
            year: '2024',
            image: 'http://tomaskastudio.pl/wp-content/uploads/2020/04/n2.jpg',
            seo_alt: 'Elegancja marmuru Calacatta Oro',
            sort_order: 1,
            gallery: [
                'http://tomaskastudio.pl/wp-content/uploads/2020/05/Wn%C4%99trze-salon-scaled.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/04/2-1.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/04/8a.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/04/4.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/70fb63ad-5a2d-408c-87ae-7e6c00f090b4.jpg'
            ]
        },
        {
            title: 'Mocniejszy akcent',
            category: '02',
            description: 'Odważna realizacja dla młodego inwestora, który nie bał się ciemnych barw i surowych faktur. Grafit, głęboki granat i czerń zostały przełamane ciepłym oświetleniem i miedzianymi dodatkami. Wnętrze ma charakter loftowy, ale z nutą elegancji.',
            year: '2023',
            image: 'http://tomaskastudio.pl/wp-content/uploads/2022/02/bd1cf092-14a9-4f67-9e1d-5da16b65b7c8.jpg',
            seo_alt: 'Mocniejszy akcent loftowy',
            sort_order: 2,
            gallery: [
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/4130333f-abf1-4255-9f6c-89b60624ef7c.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/c724fa57-df12-4135-9799-01117666bf5e.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/15e5f088-12c0-4a3f-86e1-5fb88314a4bd.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/3d16d835-b7da-41ff-aac5-b844cb2fd37d.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/6372ba35-b897-4009-a552-f55ee42dbb70.jpg'
            ]
        },
        {
            title: 'Nowoczesna klasyka',
            category: '03',
            description: 'Harmonijne połączenie klasycznych form ze współczesnym designem. Projekt domu pod Krakowem, w którym liczył się spokój i równowaga. Jasna paleta barw – beże, biele i szarości – stanowi tło dla starannie dobranych mebli i dzieł sztuki.',
            year: '2023',
            image: 'http://tomaskastudio.pl/wp-content/uploads/2022/02/161ac075-fecf-4530-ac96-e9ab78fd5d70.jpg',
            seo_alt: 'Nowoczesna klasyka',
            sort_order: 3,
            gallery: [
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/344a6e23-c3e7-4807-86f8-8c37d9105755.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/16899579-655e-420b-803f-9c0eb7cb6fc1.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/5881c6c0-903c-4971-8ffd-ef9e930b6aef.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/28ed9b50-706e-4bbe-b69f-f454561518af.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/61758a7d-2cac-4973-974c-9d940358449f.jpg'
            ]
        },
        {
            title: 'Projekty Publiczne',
            category: '04',
            description: 'Rewitalizacja zabytkowej kamienicy na potrzeby butikowego hotelu. Wyzwanie polegało na zachowaniu historycznej tkanki budynku przy jednoczesnym wprowadzeniu nowoczesnych udogodnień.',
            year: '2022',
            image: 'http://tomaskastudio.pl/wp-content/uploads/2020/02/14-1.jpg',
            seo_alt: 'Projekty Publiczne',
            sort_order: 4,
            gallery: [
                'http://tomaskastudio.pl/wp-content/uploads/2020/02/15.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/02/13-a.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/02/11.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2020/02/7-ok.jpg',
                'http://tomaskastudio.pl/wp-content/uploads/2022/02/39779e45-4413-44d5-aa2d-f9c56a99162a.jpg'
            ]
        },
        {
            title: 'Męski azyl',
            category: '05',
            description: 'Męski, zdecydowany charakter tego wnętrza podkreślają mocne kontrasty i strukturalne tynki. Projekt, który łączy funkcjonalność z surowym, ale wyrafindownym pięknem.',
            year: '2024',
            image: '/05. Męski Azyl/DRP.jpg',
            seo_alt: 'Męski azyl',
            sort_order: 5,
            gallery: [
                '/05. Męski Azyl/DRP_2.jpg',
                '/05. Męski Azyl/DRP_15.jpg',
                '/05. Męski Azyl/DRP_23.jpg',
                '/05. Męski Azyl/DRP_27.jpg',
                '/05. Męski Azyl/DRP_36.jpg',
            ]
        },
        {
            title: 'Spokojna Przestrzeń',
            category: '06',
            description: 'Wnętrze utrzymane w stonowanej, jasnej palecie barw. Naturalne materiały i minimalistyczne formy tworzą przestrzeń sprzyjającą wyciszeniu i regeneracji.',
            year: '2024',
            image: '/06. Spokojna przestrzeń/DRP_7.jpg',
            seo_alt: 'Spokojna przestrzeń',
            sort_order: 6,
            gallery: [
                '/06. Spokojna przestrzeń/DRP_32.jpg',
                '/06. Spokojna przestrzeń/DRP_36.jpg',
                '/06. Spokojna przestrzeń/DRP_38.jpg',
                '/06. Spokojna przestrzeń/DRP_42.jpg',
                '/06. Spokojna przestrzeń/DRP_58.jpg',
            ]
        },
        {
            title: 'Przytulne Wnętrze',
            category: '07',
            description: 'Ciepłe, domowe wnętrze, w którym każdy detal służy budowaniu przytulnej atmosfery. Miękkie tkaniny, naturalne drewno i starannie dobrane oświetlenie.',
            year: '2023',
            image: '/07. Przytulne wnętrze/20240620_190101.jpg',
            seo_alt: 'Przytulne Wnętrze',
            sort_order: 7,
            gallery: [
                '/07. Przytulne wnętrze/20240620_210734.jpg',
                '/07. Przytulne wnętrze/20240620_211601.jpg',
                '/07. Przytulne wnętrze/20240620_212234.jpg',
                '/07. Przytulne wnętrze/20240620_212243.jpg',
                '/07. Przytulne wnętrze/20240620_212257.jpg',
            ]
        },
        {
            title: 'Nowoczesna Forma',
            category: '08',
            description: 'Projekt łączący nowoczesne formy architektoniczne z funkcjonalnym podejściem do przestrzeni. Czyste linie i geometryczne akcenty.',
            year: '2023',
            image: '/08. Nowoczesna forma/1_3.jpg',
            seo_alt: 'Nowoczesna Forma',
            sort_order: 8,
            gallery: [
                '/08. Nowoczesna forma/1_4.jpg',
                '/08. Nowoczesna forma/1_9a.jpg',
                '/08. Nowoczesna forma/1_10a.jpg',
                '/08. Nowoczesna forma/1_15.jpg',
                '/08. Nowoczesna forma/Przedsionek 1_10b.jpg',
                '/08. Nowoczesna forma/Tv wall_1b.jpg',
            ]
        }
    ];

    const { error: projectsError } = await supabase.from('projects').insert(projects);
    if (projectsError) console.error("❌ projects error:", projectsError);
    else console.log("✅ projects seeded.");

    // 3. Testimonials
    console.log("💬 Seeding testimonials...");
    const testimonials = [
        { name: 'Anna i Marek K.', project: 'Elegancja marmuru', quote: 'Współpraca z Joanną to czysta przyjemność. Od pierwszego spotkania czuliśmy, że rozumie naszą wizję.', sort_order: 1 },
        { name: 'Tomasz W.', project: 'Męski azyl', quote: 'Szukałem projektantki, która nie boi się odważnych rozwiązań. Joanna zaproponowała beton architektoniczny.', sort_order: 2 },
        { name: 'Katarzyna i Piotr D.', project: 'Nowoczesna klasyka', quote: 'Nasz dom pod Krakowem zyskał duszę dzięki Joannie. Połączenie klasycznych sztukaterii z nowoczesnym oświetleniem to strzał w dziesiątkę.', sort_order: 3 },
        { name: 'Magdalena S.', project: 'Spokojna przestrzeń', quote: 'Po całym dniu w pracy potrzebuję wyciszenia. Joanna stworzyła przestrzeń, która jest jak azyl — jasna, spokojna.', sort_order: 4 },
        { name: 'Robert i Ewa N.', project: 'Przytulne wnętrze', quote: 'Joanna potrafiła uchwycić charakter naszej rodziny i przełożyć go na projekt. Wnętrze jest ciepłe.', sort_order: 5 }
    ];

    const { error: testimonialsError } = await supabase.from('testimonials').insert(testimonials);
    if (testimonialsError) console.error("❌ testimonials error:", testimonialsError);
    else console.log("✅ testimonials seeded.");

    // 4. Offer Steps
    console.log("🪜 Seeding offer_steps...");
    const offerSteps = [
        { step_number: '01', title: 'Przygotowanie do procesu', description: 'Spotkanie – szczegółowe omówienie inspiracji oraz potrzeb funkcjonalnych i estetycznych. Pomiar – jeśli klient nie posiada rzutu.' },
        { step_number: '02', title: 'Układ Funkcjonalny', description: 'Możliwe opcje układów z wymiarowaniem na rzucie. Czarno-białe widoki 3D. Rozwiązania materiałowe w formie inspiracji.' },
        { step_number: '03', title: 'Koncepcja Projektowa', description: 'Wizualizacje pokazujące kolorystykę i rozwiązania materiałowe we wnętrzu. Korekty oraz akceptacja rozwiązań.' },
        { step_number: '04', title: 'Dobór Materiałów i Rysunki Techniczne', description: 'Spotkanie w sklepach branżowych w celu wyboru materiałów wykończeniowych. Projekt wodno-kanalizacyjny, elektryki, mebli na wymiar.' }
    ];

    const { error: offerError } = await supabase.from('offer_steps').insert(offerSteps);
    if (offerError) console.error("❌ offer_steps error:", offerError);
    else console.log("✅ offer_steps seeded.");

    console.log("🏁 Seeding complete! All tables refilled cleanly.");
}

seed();
