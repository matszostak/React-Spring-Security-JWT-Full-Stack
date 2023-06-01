import create from 'zustand'

const useWineCartState = create((set) => {
    const storedItems = localStorage.getItem('listItems');
    const initialItems = storedItems ? JSON.parse(storedItems) : [];

    return {
        winesCart: initialItems,
        addItem: (wine) =>
            set((state) => {
                const existingItem = state.winesCart.find((item) => item.name === wine.name);
                let updatedItems;

                if (existingItem) {
                    updatedItems = state.winesCart.map((item) =>
                        item.name === wine.name ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    updatedItems = [...state.winesCart, { ...wine, quantity: 1 }];
                }

                localStorage.setItem('listItems', JSON.stringify(updatedItems));
                return { winesCart: updatedItems };
            }),
        removeItem: (name) =>
            set((state) => {
                const updatedItems = state.winesCart.map((item) => {
                    if (item.name === name) {
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return null;
                        }
                    } else {
                        return item;
                    }
                }).filter(Boolean);

                localStorage.setItem('listItems', JSON.stringify(updatedItems));
                return { winesCart: updatedItems };
            }),
        clearCart: () => {
            localStorage.removeItem('listItems');
            set({ winesCart: [] });
        },
    };
});

export default useWineCartState;
