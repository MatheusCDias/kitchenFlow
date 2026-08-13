import { useEffect, useState } from 'react';
import { MenuItemPayload, fetchMenu } from '../services/api';

// Busca o cardápio uma vez, quando quem chama monta na tela.
export const useMenu = (): MenuItemPayload[] => {
    const [menu, setMenu] = useState<MenuItemPayload[]>([]);

    useEffect(() => {
        fetchMenu().then(setMenu).catch(() => setMenu([]));
    }, []);

    return menu;
};
