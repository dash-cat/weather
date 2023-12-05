import { createStore } from "vuex";

export default createStore({
  state: {
    dishes: [
      {
        id: 1,
        name: "Борщ",
        compound: "чеснок, свекла, сметана, лук, говядина",
        description: "Вкусный наваристый борщ из дикого оленя",
        image:
          "https://cdn.lifehacker.ru/wp-content/uploads/2014/12/ob-05_1568611223-640x320.jpg",
      },
      {
        id: 2,
        name: "Борщ",
        compound: "чеснок, свекла, сметана, лук, говядина",
        description: "Вкусный наваристый борщ из дикого оленя",
        image:
          "https://cdn.lifehacker.ru/wp-content/uploads/2014/12/ob-05_1568611223-640x320.jpg",
      },
    ],
    // mutations: {
    //   addDish( state: { dishes: [] }, dish: {string: any}) {
    //     state.dishes.push(dish);
    //   },
    // },
  },
});
