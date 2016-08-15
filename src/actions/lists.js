import faker from 'faker';

export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';

export const MOVE_CARD = 'MOVE_CARD';


export function getLists(quantity) {
  return dispatch => {
    dispatch({ type: GET_LISTS_START, quantity });
    setTimeout(() => {
      const lists = [];
      let count = 0;
      for (let i = 0; i < quantity; i++) {
        const cards = [];
        const randomQuantity = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        for (let ic = 0; ic < randomQuantity; ic++) {
          cards.push({
            id: count,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            title: faker.name.jobTitle()
          });
          count = count + 1;
        }
        lists.push({
          id: i,
          name: faker.commerce.productName(),
          cards
        });
      }
      dispatch({ type: GET_LISTS, lists, isFetching: true });
    }, 1000); // fake delay
    dispatch({ type: GET_LISTS_START, isFetching: false });
  };
}

export function moveCard(lastX, lastY, nextX, nextY) {
  return (dispatch) => {
    dispatch({ type: MOVE_CARD, lastX, lastY, nextX, nextY });
  };
}
