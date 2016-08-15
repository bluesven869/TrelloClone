import { Record } from 'immutable';

import {
  GET_LISTS,
  GET_LISTS_START,
  MOVE_CARD
} from '../actions/lists';

/* eslint-disable new-cap */
const InitialState = Record({
  isFetching: false,
  lists: []
});
/* eslint-enable new-cap */
const initialState = new InitialState;


export default function lists(state = initialState, action) {
  switch (action.type) {
    case GET_LISTS_START:
      return state.set('isFetching', true);
    case GET_LISTS:
      return state.withMutations((ctx) => {
        ctx.set('isFetching', false)
            .set('lists', action.lists);
      });
    case MOVE_CARD: {
      const newLists = [...state.lists];
      const { lastX, lastY, nextX, nextY } = action;
      if (lastX === nextX) {
        // if (newIndex >= arr.length) {
        //   // place card at the end of the arr
        //   let k = newIndex - arr.length;
        //   while ((k--) + 1) {
        //     arr.push(undefined);
        //   }
        // }
        newLists[lastX].cards.splice(nextY, 0, newLists[lastX].cards.splice(lastY, 1)[0]);
      } else {
        // move element to new place
        newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
        // delete element from old place
        newLists[lastX].cards.splice(lastY, 1);
      }
      return state.withMutations((ctx) => {
        ctx.set('lists', newLists);
      });
    }
    default:
      return state;
  }
}
