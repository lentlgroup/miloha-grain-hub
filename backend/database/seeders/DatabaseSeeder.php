<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Role;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $permissionDefinitions = [
            'manage-site-content' => 'Create and update homepage content blocks and FAQs.',
            'manage-products' => 'Create and update the product catalog.',
            'manage-inquiries' => 'Review and manage customer quote requests.',
            'manage-users' => 'Assign roles and manage user access.',
            'view-admin-dashboard' => 'Open the internal admin workspace.',
        ];

        foreach ($permissionDefinitions as $name => $description) {
            Permission::query()->updateOrCreate(
                ['name' => $name],
                ['description' => $description],
            );
        }

        $roleDefinitions = [
            'super-admin' => [
                'description' => 'Full access to every protected backend capability.',
                'permissions' => array_keys($permissionDefinitions),
            ],
            'content-manager' => [
                'description' => 'Manages homepage content and product information.',
                'permissions' => ['manage-site-content', 'manage-products', 'view-admin-dashboard'],
            ],
            'sales-manager' => [
                'description' => 'Handles customer inquiries and sales follow-up.',
                'permissions' => ['manage-inquiries', 'view-admin-dashboard'],
            ],
            'viewer' => [
                'description' => 'Read-only internal access placeholder for future dashboards.',
                'permissions' => ['view-admin-dashboard'],
            ],
        ];

        foreach ($roleDefinitions as $name => $definition) {
            $role = Role::query()->updateOrCreate(
                ['name' => $name],
                ['description' => $definition['description']],
            );

            $role->syncPermissions($definition['permissions']);
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'homepage'],
            [
                'trust_metrics' => [
                    [
                        'value' => 500,
                        'suffix' => '+',
                        'label' => 'Retail & wholesale orders supported',
                        'detail' => 'Flexible order handling for homes, retailers, and institutions.',
                        'translations' => [
                            'sw' => [
                                'label' => 'Oda za rejareja na jumla zilizohudumiwa',
                                'detail' => 'Huduma rahisi kwa nyumba, wauzaji wa rejareja, na taasisi.',
                            ],
                        ],
                    ],
                    [
                        'value' => 98,
                        'suffix' => '%',
                        'label' => 'Quality check pass confidence',
                        'detail' => 'Careful sorting, drying, and inspection before dispatch.',
                        'translations' => [
                            'sw' => [
                                'label' => 'Uhakika wa kupita ukaguzi wa ubora',
                                'detail' => 'Upangaji, ukaushaji, na ukaguzi wa makini kabla ya kusafirishwa.',
                            ],
                        ],
                    ],
                    [
                        'value' => 12,
                        'suffix' => '',
                        'label' => 'Packaging and bulk supply formats',
                        'detail' => 'Structured for shelf-ready, household, and large-volume buyers.',
                        'translations' => [
                            'sw' => [
                                'label' => 'Aina za vifungashio na usambazaji wa jumla',
                                'detail' => 'Imeandaliwa kwa rafu za maduka, matumizi ya nyumbani, na wanunuzi wa kiasi kikubwa.',
                            ],
                        ],
                    ],
                    [
                        'value' => 8,
                        'suffix' => '+',
                        'label' => 'Coverage zones around Dar es Salaam',
                        'detail' => 'Fast response for city deliveries and arranged regional dispatch.',
                        'translations' => [
                            'sw' => [
                                'label' => 'Maeneo ya huduma ndani na karibu na Dar es Salaam',
                                'detail' => 'Majibu ya haraka kwa usafirishaji wa jiji na mipango ya mikoani.',
                            ],
                        ],
                    ],
                ],
                'process_steps' => [
                    [
                        'title' => 'Farm Sourcing',
                        'desc' => 'We work with trusted farming networks and source grains aligned with our purity and consistency standards.',
                        'translations' => [
                            'sw' => [
                                'title' => 'Upatikanaji Kutoka Mashambani',
                                'desc' => 'Tunafanya kazi na mitandao ya wakulima wanaoaminika kupata nafaka zinazokidhi viwango vyetu vya usafi na uthabiti.',
                            ],
                        ],
                    ],
                    [
                        'title' => 'Cleaning & Sorting',
                        'desc' => 'Batches are cleaned, graded, and sorted to remove impurities and improve uniformity.',
                        'translations' => [
                            'sw' => [
                                'title' => 'Usafishaji na Upangaji',
                                'desc' => 'Bidhaa husafishwa, hupangwa kwa viwango, na kuchambuliwa ili kuondoa uchafu na kuongeza ulinganifu.',
                            ],
                        ],
                    ],
                    [
                        'title' => 'Quality Review',
                        'desc' => 'Moisture, freshness, and visual quality are checked before stock moves into packaging or bulk handling.',
                        'translations' => [
                            'sw' => [
                                'title' => 'Ukaguzi wa Ubora',
                                'desc' => 'Unyevu, ubichi, na mwonekano hukaguliwa kabla ya bidhaa kuingia kwenye ufungashaji au usimamizi wa jumla.',
                            ],
                        ],
                    ],
                    [
                        'title' => 'Packaging & Storage',
                        'desc' => 'Products are packed for household, retail, or wholesale channels and stored for freshness.',
                        'translations' => [
                            'sw' => [
                                'title' => 'Ufungashaji na Uhifadhi',
                                'desc' => 'Bidhaa hufungwa kwa matumizi ya nyumbani, rejareja, au jumla na kuhifadhiwa kwa ubora na ubichi.',
                            ],
                        ],
                    ],
                    [
                        'title' => 'Delivery & Fulfillment',
                        'desc' => 'Orders are coordinated for pickup, city delivery, or arranged up-country distribution.',
                        'translations' => [
                            'sw' => [
                                'title' => 'Usafirishaji na Utekelezaji',
                                'desc' => 'Oda huratibiwa kwa kuchukuliwa dukani, kupelekwa ndani ya jiji, au kusafirishwa mikoani.',
                            ],
                        ],
                    ],
                ],
                'delivery_zones' => [
                    [
                        'zone' => 'Tegeta to City Center',
                        'eta' => 'Same day',
                        'note' => 'Fast turnaround for stocked items and repeat buyers.',
                        'translations' => [
                            'sw' => [
                                'zone' => 'Tegeta hadi Katikati ya Jiji',
                                'eta' => 'Siku hiyo hiyo',
                                'note' => 'Huduma ya haraka kwa bidhaa zilizopo stoo na wanunuzi wa mara kwa mara.',
                            ],
                        ],
                    ],
                    [
                        'zone' => 'Kinondoni & Ubungo',
                        'eta' => 'Within 24 hours',
                        'note' => 'Reliable coverage for homes, restaurants, and mini-markets.',
                        'translations' => [
                            'sw' => [
                                'zone' => 'Kinondoni na Ubungo',
                                'eta' => 'Ndani ya saa 24',
                                'note' => 'Huduma thabiti kwa nyumba, migahawa, na maduka madogo.',
                            ],
                        ],
                    ],
                    [
                        'zone' => 'Temeke & Kigamboni',
                        'eta' => '24-48 hours',
                        'note' => 'Scheduled dispatch with quantity-based planning.',
                        'translations' => [
                            'sw' => [
                                'zone' => 'Temeke na Kigamboni',
                                'eta' => 'Saa 24-48',
                                'note' => 'Usafirishaji uliopangwa kulingana na kiasi cha oda.',
                            ],
                        ],
                    ],
                    [
                        'zone' => 'Up-country supply',
                        'eta' => 'Planned dispatch',
                        'note' => 'Bulk shipment support for institutions and wholesale partners.',
                        'translations' => [
                            'sw' => [
                                'zone' => 'Usambazaji wa Mikoani',
                                'eta' => 'Usafirishaji uliopangwa',
                                'note' => 'Msaada wa shehena kubwa kwa taasisi na washirika wa jumla.',
                            ],
                        ],
                    ],
                ],
                'buyer_logos' => [
                    'Azania Retail',
                    'Dar Fresh Mart',
                    'Safari Kitchens',
                    'EastBay Traders',
                    'Karibu Stores',
                ],
                'promo_highlights' => [
                    [
                        'text' => 'New-season rice and maize sourcing now available for planned wholesale orders.',
                        'translations' => [
                            'sw' => [
                                'text' => 'Mchele na mahindi ya msimu mpya sasa yanapatikana kwa oda za jumla zilizopangwa.',
                            ],
                        ],
                    ],
                    [
                        'text' => 'Retail-ready packaged grain bundles prepared for mini-markets and neighborhood shops.',
                        'translations' => [
                            'sw' => [
                                'text' => 'Vifurushi vya nafaka vilivyofungashwa tayari kwa rejareja vimeandaliwa kwa maduka madogo na ya jirani.',
                            ],
                        ],
                    ],
                    [
                        'text' => 'Priority response for repeat customers placing weekly or monthly replenishment requests.',
                        'translations' => [
                            'sw' => [
                                'text' => 'Majibu ya kipaumbele kwa wateja wa kurudia wanaoweka oda za kila wiki au kila mwezi.',
                            ],
                        ],
                    ],
                ],
            ]
        );

        $products = [
            [
                'slug' => 'rice',
                'name' => 'Premium Rice',
                'description' => "Grade A polished and unpolished rice varieties sourced from Tanzania's finest paddy fields.",
                'tag' => 'Best Seller',
                'image_key' => 'rice',
                'categories' => ['retail', 'wholesale', 'bulk'],
                'sizes' => ['1kg', '5kg', '25kg', '50kg'],
                'uses' => ['Home cooking', 'Hospitality supply', 'Bulk resale'],
                'highlights' => ['Low moisture handling', 'Clean sorted grains', 'Reliable supply consistency'],
                'nutrition' => [
                    ['label' => 'Energy', 'value' => '365 kcal'],
                    ['label' => 'Protein', 'value' => '7g'],
                    ['label' => 'Carbs', 'value' => '80g'],
                ],
                'translations' => [
                    'sw' => [
                        'name' => 'Mchele Bora',
                        'description' => 'Aina za mchele wa daraja la A uliokobolewa na usiokobolewa kutoka mashamba bora ya mpunga Tanzania.',
                        'tag' => 'Inayouzwa Sana',
                        'uses' => ['Mapishi ya nyumbani', 'Ugavi wa hoteli', 'Biashara ya jumla'],
                        'highlights' => ['Udhibiti mzuri wa unyevu', 'Nafaka safi zilizochambuliwa', 'Upatikanaji wa uhakika'],
                        'nutrition' => [
                            ['label' => 'Nishati', 'value' => '365 kcal'],
                            ['label' => 'Protini', 'value' => '7g'],
                            ['label' => 'Wanga', 'value' => '80g'],
                        ],
                    ],
                ],
                'sort_order' => 1,
            ],
            [
                'slug' => 'maize',
                'name' => 'Quality Maize',
                'description' => 'Clean, dried and sorted maize kernels ideal for ugali, flour milling, and animal feed.',
                'tag' => 'Popular',
                'image_key' => 'maize',
                'categories' => ['retail', 'wholesale', 'bulk'],
                'sizes' => ['5kg', '25kg', '50kg'],
                'uses' => ['Ugali', 'Flour milling', 'Feed programs'],
                'highlights' => ['Well-dried stock', 'Batch inspected', 'Flexible order volumes'],
                'nutrition' => [
                    ['label' => 'Energy', 'value' => '365 kcal'],
                    ['label' => 'Fiber', 'value' => '7g'],
                    ['label' => 'Protein', 'value' => '9g'],
                ],
                'translations' => [
                    'sw' => [
                        'name' => 'Mahindi Bora',
                        'description' => 'Mahindi safi, yaliyokaushwa na kuchambuliwa yanayofaa kwa ugali, kusaga unga, na chakula cha mifugo.',
                        'tag' => 'Maarufu',
                        'uses' => ['Ugali', 'Usagaji wa unga', 'Mipango ya chakula cha mifugo'],
                        'highlights' => ['Yamekaushwa vizuri', 'Yamekaguliwa kwa mafungu', 'Kiasi cha oda ni rahisi kubadilika'],
                        'nutrition' => [
                            ['label' => 'Nishati', 'value' => '365 kcal'],
                            ['label' => 'Nyuzi', 'value' => '7g'],
                            ['label' => 'Protini', 'value' => '9g'],
                        ],
                    ],
                ],
                'sort_order' => 2,
            ],
            [
                'slug' => 'beans',
                'name' => 'Mixed Beans',
                'description' => 'Nutritious bean varieties - kidney, soy, black, and mixed - rich in protein and fiber.',
                'tag' => 'Nutritious',
                'image_key' => 'beans',
                'categories' => ['retail', 'wholesale'],
                'sizes' => ['1kg', '5kg', '25kg'],
                'uses' => ['Home meals', 'School supply', 'Catering kitchens'],
                'highlights' => ['Protein-rich selection', 'Color-sorted varieties', 'Retail-ready packaging'],
                'nutrition' => [
                    ['label' => 'Protein', 'value' => '21g'],
                    ['label' => 'Fiber', 'value' => '16g'],
                    ['label' => 'Iron', 'value' => '5mg'],
                ],
                'translations' => [
                    'sw' => [
                        'name' => 'Maharage Mchanganyiko',
                        'description' => 'Aina mbalimbali za maharage kama red kidney, soya, black, na mchanganyiko zenye protini na nyuzi nyingi.',
                        'tag' => 'Yenye Lishe',
                        'uses' => ['Milo ya nyumbani', 'Ugavi wa shule', 'Jikoni za upishi'],
                        'highlights' => ['Chaguo lenye protini nyingi', 'Aina zimepangwa kwa rangi', 'Ufungashaji tayari kwa rejareja'],
                        'nutrition' => [
                            ['label' => 'Protini', 'value' => '21g'],
                            ['label' => 'Nyuzi', 'value' => '16g'],
                            ['label' => 'Madini ya Chuma', 'value' => '5mg'],
                        ],
                    ],
                ],
                'sort_order' => 3,
            ],
            [
                'slug' => 'packaged',
                'name' => 'Packaged Products',
                'description' => 'Branded MILOHA packaged grains ready for retail shelves, available in 1kg, 5kg, and 25kg bags.',
                'tag' => 'New',
                'image_key' => 'packaged',
                'categories' => ['packaged', 'retail', 'wholesale'],
                'sizes' => ['1kg', '5kg', '25kg'],
                'uses' => ['Retail shelves', 'Mini-markets', 'Promotional bundles'],
                'highlights' => ['Shelf-ready branding', 'Tamper-conscious packaging', 'Consistent label presentation'],
                'nutrition' => [
                    ['label' => 'Formats', 'value' => '3 sizes'],
                    ['label' => 'Shelf Ready', 'value' => 'Yes'],
                    ['label' => 'Branding', 'value' => 'Custom'],
                ],
                'translations' => [
                    'sw' => [
                        'name' => 'Bidhaa Zilizofungashwa',
                        'description' => 'Nafaka za MILOHA zilizofungashwa tayari kwa rafu za maduka, zinapatikana katika mifuko ya 1kg, 5kg, na 25kg.',
                        'tag' => 'Mpya',
                        'uses' => ['Rafu za maduka', 'Mini-market', 'Vifurushi vya promosheni'],
                        'highlights' => ['Muonekano tayari kwa rafu', 'Ufungashaji unaozingatia usalama', 'Muonekano thabiti wa lebo'],
                        'nutrition' => [
                            ['label' => 'Aina', 'value' => 'Saizi 3'],
                            ['label' => 'Tayari kwa Rafu', 'value' => 'Ndiyo'],
                            ['label' => 'Chapa', 'value' => 'Maalum'],
                        ],
                    ],
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }

        $faqs = [
            [
                'question' => 'Do you support both small and bulk orders?',
                'answer' => 'Yes. MILOHA serves household buyers, retail shelves, restaurants, institutions, and bulk wholesale customers with different packaging sizes.',
                'translations' => [
                    'sw' => [
                        'question' => 'Je, mnahudumia oda ndogo na kubwa?',
                        'answer' => 'Ndiyo. MILOHA huhudumia wanunuzi wa nyumbani, rafu za rejareja, migahawa, taasisi, na wateja wa jumla kwa saizi tofauti za vifungashio.',
                    ],
                ],
                'sort_order' => 1,
            ],
            [
                'question' => 'Can I request delivery outside Dar es Salaam?',
                'answer' => 'Yes. Regional and up-country delivery can be arranged based on quantity, destination, and dispatch planning.',
                'translations' => [
                    'sw' => [
                        'question' => 'Je, naweza kuomba usafirishaji nje ya Dar es Salaam?',
                        'answer' => 'Ndiyo. Usafirishaji wa mikoani unaweza kupangwa kulingana na kiasi, eneo la kufikisha, na mpango wa usafirishaji.',
                    ],
                ],
                'sort_order' => 2,
            ],
            [
                'question' => 'Are packaged products available for retail shelves?',
                'answer' => 'Yes. Our branded packaged formats are designed for shelves and available in multiple sizes depending on the product line.',
                'translations' => [
                    'sw' => [
                        'question' => 'Je, bidhaa zilizofungashwa zinapatikana kwa rafu za rejareja?',
                        'answer' => 'Ndiyo. Bidhaa zetu zilizofungashwa kwa chapa zimeundwa kwa rafu za maduka na zinapatikana kwa saizi tofauti kulingana na mstari wa bidhaa.',
                    ],
                ],
                'sort_order' => 3,
            ],
            [
                'question' => 'How do I place a custom quote request?',
                'answer' => 'Use the inquiry form to choose buyer type, product, packaging, and estimated quantity, or contact us directly through WhatsApp for faster coordination.',
                'translations' => [
                    'sw' => [
                        'question' => 'Ninawezaje kuomba bei maalum?',
                        'answer' => 'Tumia fomu ya maombi kuchagua aina ya mnunuzi, bidhaa, kifungashio, na kiasi kinachokadiriwa, au wasiliana nasi moja kwa moja kupitia WhatsApp kwa uratibu wa haraka.',
                    ],
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::query()->updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }

        $testimonials = [
            [
                'quote' => 'The packaging quality and grain consistency have made MILOHA easier for us to stock and recommend in-store.',
                'name' => 'Retail Partner',
                'role' => 'Mini-market buyer',
                'translations' => [
                    'sw' => [
                        'quote' => 'Ubora wa ufungashaji na uthabiti wa nafaka umeifanya MILOHA kuwa rahisi zaidi kwetu kuiweka dukani na kuipendekeza.',
                        'name' => 'Mshirika wa Rejareja',
                        'role' => 'Mnunuzi wa mini-market',
                    ],
                ],
                'sort_order' => 1,
            ],
            [
                'quote' => 'Their delivery coordination is smooth, and the maize quality has stayed dependable across repeat orders.',
                'name' => 'Hospitality Client',
                'role' => 'Kitchen procurement lead',
                'translations' => [
                    'sw' => [
                        'quote' => 'Uratibu wao wa usafirishaji ni mzuri, na ubora wa mahindi umeendelea kuwa wa kuaminika katika oda za kurudia.',
                        'name' => 'Mteja wa Huduma za Ukarimu',
                        'role' => 'Msimamizi wa manunuzi ya jikoni',
                    ],
                ],
                'sort_order' => 2,
            ],
            [
                'quote' => 'For wholesale supply, what stands out is how clearly they communicate sizes, availability, and dispatch timing.',
                'name' => 'Distributor',
                'role' => 'Bulk supply customer',
                'translations' => [
                    'sw' => [
                        'quote' => 'Kwa ugavi wa jumla, kinachoonekana zaidi ni jinsi wanavyowasilisha kwa uwazi saizi, upatikanaji, na muda wa usafirishaji.',
                        'name' => 'Msambazaji',
                        'role' => 'Mteja wa ugavi wa kiasi kikubwa',
                    ],
                ],
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::query()->updateOrCreate(
                ['quote' => $testimonial['quote']],
                $testimonial
            );
        }

        if (app()->environment('local')) {
            $adminUser = User::query()->updateOrCreate(
                ['email' => 'admin@miloha.local'],
                [
                    'name' => 'Local Admin',
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );

            $adminUser->syncRoles(['super-admin']);
        }
    }
}
