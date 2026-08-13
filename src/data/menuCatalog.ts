// Cardápio real do restaurante (Home Sushi Home), extraído do site em
// 2026-08-13. Preço ainda não é usado em lugar nenhum do app, por isso
// todo item nasce com price = 0 — é só um espaço reservado pra quando
// o app passar a lidar com valores.
//
// Alguns itens do cardápio original ficaram de fora por enquanto: são
// produtos "escolha seu sabor" (Makimonos, Hot's, Joe's, Niguiris,
// Temakis diversos, Sunomono's, Carpaccio's, Robata's, Teppan Yaki's,
// Refrigerantes) cuja lista de sabores estava cortada no site. Assim que
// tivermos essa lista completa, é só adicionar aqui.
import { MenuItem } from '../models/menu/MenuItem';
import { FoodItem } from '../models/menu/FoodItem';
import { DrinkItem } from '../models/menu/DrinkItem';
import { CategoryEnum } from '../enums/CategoryEnum';
import { DrinkTypeEnum } from '../enums/DrinkTypeEnum';

const NOW = new Date();
let nextMenuId = 1;

const food = (
    name: string,
    description: string,
    category: CategoryEnum,
    servesPeople: number = 1
): FoodItem => new FoodItem(`menu-${nextMenuId++}`, name, 0, description, 2026, 8, NOW, category, servesPeople);

const drink = (name: string, description: string): DrinkItem =>
    new DrinkItem(`menu-${nextMenuId++}`, name, 0, description, 2026, 8, false, DrinkTypeEnum.BOTTLE);

export const menuCatalog: MenuItem[] = [
    // ----- Geral -----
    food('Kit: hashi, shoyu...', 'Nos informe quantas pessoas irão consumir o pedido.', CategoryEnum.GENERAL),

    // ----- Manda Mangu -----
    food('Combo 2 Pokes ManguShoyu', 'Escolha 2 pokes de sua preferência.', CategoryEnum.GENERAL, 2),
    food('Combo 3 Pokes ManguShoyu', 'Escolha 3 pokes de sua preferência.', CategoryEnum.GENERAL, 3),

    // ----- Promoções -----
    food('Salmon Ball - 6 unidades', 'Bolinhas de pasta de salmão grelhado com cream cheese e cebolinha, empanadas com panko.', CategoryEnum.PROMOTION),
    food('Combinado Salmão Grelhado (12 peças) + Temaki Salmão Grelhado', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION),
    food('Compre 01 Combinado da Turma e Ganhe 02 Sobremesas', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 4),
    food('Combinado Campeão + Sobremesa ou Refri Grátis', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 3),
    food('Combinado No Precinho (50 peças) + Salmon Ball (6 peças)', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 4),
    food('Combinado Clássico (20 peças) + 01 Refrigerante', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 2),
    food('Combinado Mini No Precinho (25 peças) + Sobremesa + Refrigerante', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 2),
    food('Combinado Mix Degustação (17 peças) + Sobremesa + Refrigerante', 'Não admite-se trocas neste combinado.', CategoryEnum.PROMOTION, 2),
    food('Combo Skin: 01 Temaki + 10 Uramakis + 02 Niguiris', 'Combinação para os amantes de pele de salmão: 1 Temaki Skin, 10 Uramakis e 2 Niguiris.', CategoryEnum.PROMOTION, 2),
    food('02 Temakis + Sobremesa + Refrigerante', 'Escolha os temakis + sobremesa + refrigerante.', CategoryEnum.PROMOTION, 2),

    // ----- Loucos por Camarão -----
    food('Temaki Ebi [15% off]', 'Temaki de camarão (Ebi).', CategoryEnum.SHRIMP_SPECIALTY),
    food('Temaki Ebi Tem [15% off]', 'Temaki de camarão empanado (Ebi Tem).', CategoryEnum.SHRIMP_SPECIALTY),
    food('Combinado Só Camarão - 12 peças [15% off]', '(1 pessoa) 12 peças: (5) Ebigô, (5) Ebi Nirá, (2) Joe só camarão (com cream cheese).', CategoryEnum.SHRIMP_SPECIALTY),
    food('Combinado Home Ebi Home - 22 peças [15% off]', '(1-2 pessoas) 22 peças: (5) Ura Braseado, (5) Ebi roll (levemente apimentado), (5) Ebigô, (3) Niguiri.', CategoryEnum.SHRIMP_SPECIALTY, 2),
    food('Combinado Santo Camarão - 28 peças [15% off]', '(1-2 pessoas) 28 peças: (4) Joe só camarão (cream cheese), (4) Joe camarão empanado, (5) Hot roll camarão.', CategoryEnum.SHRIMP_SPECIALTY, 2),

    // ----- Individuais Incríveis -----
    food('Combinado Só Camarão - 12 peças', '(1 pessoa) 12 peças: (5) Ebigô, (5) Ebi Nirá, (2) Joe só camarão (com cream cheese).', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Peixinho de Lei - 16 peças', '(1 pessoa) 16 peças: (4) Uramaki Filadélfia, (4) Joe tradicional de salmão (com arroz), (4) Niguiri de salmão.', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Salmão Grelhado - 12 peças', '(1 pessoa) 12 peças: (5) Uramaki salmão grelhado, (5) Hot salmão grelhado e (2) Joe salmão grelhado.', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Mini Shake Home - 12 peças', '(1 pessoa) 12 peças: (3) Uramaki Filadélfia, (2) Joe tradicional de salmão (com arroz), (2) Crispy.', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Individual - 12 peças', '(1 pessoa) 12 peças: (3) Uramaki Filadélfia, (3) Joe tradicional de salmão (com arroz), (3) Hot roll.', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Sushi Fit - 20 peças', '(1-2 pessoas) 20 peças: (5) Joe de Shitake marinado, (5) Pepino maki (camarão), (5) Uramaki Filadélfia.', CategoryEnum.INDIVIDUAL_COMBO, 2),
    food('Combinado Mix Degustação - 17 peças', '(1-2 pessoas) 17 peças: (4) Kani shake, (3) Niguiri ebi furai (camarão), (2) Joe só camarão (com cream cheese).', CategoryEnum.INDIVIDUAL_COMBO, 2),
    food('Combinado Mini No Precinho - 25 peças', '(2 pessoas) 25 peças: (5) Uramaki salmão grelhado, (5) Hot salmão grelhado, (5) Hossomaki de salmão.', CategoryEnum.INDIVIDUAL_COMBO, 2),
    food('Combinado Clássico - 20 peças', '(1-2 pessoas) 20 peças: (5) Uramaki Filadélfia, (5) Joe tradicional de salmão (com arroz), (5) Niguiri.', CategoryEnum.INDIVIDUAL_COMBO, 2),
    food('Combinado Tradicional - 12 peças', '(1 pessoa) 12 peças: (3) Sashimi de salmão, (2) Niguiri de salmão, (2) Niguiri de camarão e (5) Uramaki.', CategoryEnum.INDIVIDUAL_COMBO),
    food('Combinado Hot - 12 peças', '(1 pessoa) 12 peças: (5) Hot roll camarão e salmão, (5) Hot roll salmão e (2) Niguiri Skin.', CategoryEnum.INDIVIDUAL_COMBO),

    // ----- Pra Compartilhar -----
    food('Combinado Santo Camarão - 28 peças', '(1-2 pessoas) 28 peças: (4) Joe só camarão (cream cheese), (4) Joe camarão empanado, (5) Hot roll camarão.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Melhor que Chocolate - 44 peças', '(3-4 pessoas) 44 peças variadas de salmão e camarão: (5) Sashimi de salmão, (2) Niguiri de salmão.', CategoryEnum.SHARED_COMBO, 4),
    food('Combinado Home Ebi Home - 22 peças', '(1-2 pessoas) 22 peças: (5) Ura Braseado, (5) Ebi roll (levemente apimentado), (5) Ebigô, (3) Niguiri.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Home Shake Home - 22 peças', '(1-2 pessoas) 22 peças: (4) Sashimi de salmão, (4) Sashimi de salmão selado, (2) Niguiri de salmão.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Campeão - 34 peças', '(2-3 pessoas) 34 peças: (5) Sashimi de salmão, (5) Sashimi de atum selado, (2) Niguiri ebi furai (camarão).', CategoryEnum.SHARED_COMBO, 3),
    food('Combinado No Precinho - 50 peças', '(3-4 pessoas) 50 peças: (10) Uramaki de salmão grelhado, (10) Hot salmão grelhado, (10) Hossomaki de salmão.', CategoryEnum.SHARED_COMBO, 4),
    food('Combinado da Turma - 45 peças', '(3-4 pessoas) 45 peças: (5) Sashimi de salmão, (5) Sashimi de atum, (5) Sashimi de peixe branco.', CategoryEnum.SHARED_COMBO, 4),
    food("Combinado Joe's - 20 peças", '(1-2 pessoas) 20 peças a sua escolha.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Família - 55 peças', '(4-5 pessoas) 55 peças: (8) Sashimi de salmão, (8) Hossomaki de salmão, (3) Niguiri de salmão.', CategoryEnum.SHARED_COMBO, 5),
    food('Combinado Hot & Crispy - 22 peças', '(1-2 pessoas) 22 peças: (2) Joe só camarão (com cream cheese), (5) Harumaki de camarão, salmão e kani.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Home Tuna Home - 22 peças', '(1-2 pessoas) 22 peças: (5) Sashimi de atum, (5) Sashimi de atum selado, (5) Niguiri de atum.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado Home Vegan Home - 22 peças', '(1-2 pessoas) 22 peças: (3) Niguiri de Brócolis, (3) Niguiri de Berinjela empanada, (5) Hot roll vegano.', CategoryEnum.SHARED_COMBO, 2),
    food('Combinado da Confra - 100 peças', '(7-8 pessoas) 100 peças: (10) Sashimi de salmão, (8) Hossomaki de salmão, (6) Niguiri de salmão.', CategoryEnum.SHARED_COMBO, 8),

    // ----- Monte sua Caixinha -----
    food('Sashimi Barriga de Salmão - 6 unidades', 'Sashimi de barriga de salmão.', CategoryEnum.BUILD_YOUR_BOX),
    food('Sashimi Salmão Selado - 6 unidades', 'Sashimi de salmão selado.', CategoryEnum.BUILD_YOUR_BOX),
    food('Sashimi Salmão Marinado - 6 unidades', 'Sashimi de salmão marinado.', CategoryEnum.BUILD_YOUR_BOX),
    food('Sashimi Salmão Maçaricado - 6 unidades', 'Sashimi de salmão maçaricado.', CategoryEnum.BUILD_YOUR_BOX),
    food('Sashimi de Atum - 6 unidades', 'Sashimi de atum.', CategoryEnum.BUILD_YOUR_BOX),
    food('Sashimi de Peixe Branco - 6 unidades', 'Sashimi de peixe branco.', CategoryEnum.BUILD_YOUR_BOX),

    // ----- ManguShoyu (Poke) -----
    food('Meu ManguShoyu', 'Uma receita personalizada a cada pedido. Seja criativo!', CategoryEnum.POKE),
    food('Poke de Atum', 'Poke à base de shari (arroz japonês temperado) de atum com abacate, crispy de alho poró, tomate cereja.', CategoryEnum.POKE),
    food('Poke de Camarão', 'Poke à base de shari (arroz japonês temperado) com camarão, cenoura ralada, crispy de couve folha.', CategoryEnum.POKE),
    food('Poke de Salmão', 'Poke à base de shari (arroz japonês temperado) com salmão fresco em cubos com sunomono (salada de pepino).', CategoryEnum.POKE),
    food('Poke Vegetariano', 'Poke à base de shari (arroz japonês temperado) com mix de cogumelos (shitake e shimeji) refogados.', CategoryEnum.POKE),
    food('Sunomono', 'Deliciosa salada de pepino temperada, finalizada com gergelim moído. (Adicione a proteína, de acordo.)', CategoryEnum.POKE),

    // ----- Hot Chop (Asian Food) -----
    food('Bifum de Frango ao Curry', 'Fios de macarrão de arroz envolvidos em sabores orientais.', CategoryEnum.ASIAN_FOOD),
    food('Yakimeshi de Camarão e Shimeji', 'Arroz japonês frito e temperado, camarões, cogumelos shimeji e ovo. Finalizado com cebolinha.', CategoryEnum.ASIAN_FOOD),
    food('Yakisoba de Camarão', 'A tradicional receita chinesa com o toque japonês do HSH.', CategoryEnum.ASIAN_FOOD),
    food('Yakisoba de Carne', 'Macarrão frito com tiras suculentas de carne e legumes crocantes.', CategoryEnum.ASIAN_FOOD),

    // ----- Temakis -----
    food('Temaki Salmão Maçaricado', 'Temaki à base de salmão maçaricado.', CategoryEnum.TEMAKI),
    food('Temaki Salmão Trufado', 'Temaki à base de salmão trufado.', CategoryEnum.TEMAKI),
    food('Temaki Salmão Hot', 'Temaki à base de salmão hot.', CategoryEnum.TEMAKI),
    food('Temaki Salmão Grelhado', 'Temaki à base de salmão grelhado.', CategoryEnum.TEMAKI),
    food('Temaki Salmão Skin', 'Temaki à base de pele de salmão (skin).', CategoryEnum.TEMAKI),
    food('Temaki Salmão Shimeji', 'Temaki à base de salmão com shimeji.', CategoryEnum.TEMAKI),
    food('Wrap Home Sushi Home', 'Camarões empanados, cream cheese, arroz e cebolinha envoltos por lâmina de salmão maçaricada.', CategoryEnum.TEMAKI),

    // ----- Especiais -----
    food('Crispy de Salmão - 6 unidades', 'Couve folha levemente frita acompanhada de cream cheese e envolta por lâmina de salmão.', CategoryEnum.SPECIAL),
    food('Ebi Sake', 'Camarão com patê de salmão, cream cheese e cebolinha empanados. (5 ou 10 unidades)', CategoryEnum.SPECIAL),
    food('Shimeji na Manteiga e Shoyu', '(Vegetariano) Porção de cogumelos do tipo shimeji puxado na manteiga e sakê, finalizado com cebolinha.', CategoryEnum.SPECIAL),

    // ----- Sobremesas -----
    food('Harumaki de Churros', 'Massa de harumaki recheada com doce de leite, empanado com açúcar e canela. (1 unidade)', CategoryEnum.DESSERT),
    food('Harumaki de Doce de Leite', 'Massa de harumaki recheada com doce de leite cremoso. (1 unidade)', CategoryEnum.DESSERT),
    food('Harumaki de Nutella', 'Massa de harumaki recheada com creme de avelã nutella. (1 unidade)', CategoryEnum.DESSERT),
    food('Harumaki de Romeu e Julieta', 'Massa de harumaki recheada com goiabada cascão e cream cheese. (1 unidade)', CategoryEnum.DESSERT),

    // ----- Bebidas -----
    drink('Água Mineral', '500 ml'),
];
