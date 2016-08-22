import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import Card from './DraggableCard';


function getPlaceholderIndex(y, scrollY) {
  let placeholderIndex;

  // t0d0: change cardHeight from const
  const cardHeight = 161; // height of a single card(excluding marginBottom/paddingBottom)
  const cardMargin = 10; // height of a marginBottom+paddingBottom

  // t0d0: change offsetHeight from const
  const offsetHeight = 84; // height offset from the top of the page

  // we start counting from the top of dragTarget
  const yPos = y - offsetHeight + scrollY;

  if (yPos < cardHeight / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - cardHeight / 2) / (cardHeight + cardMargin));
  }

  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    const { placeholderIndex } = component.state;
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    const nextY = placeholderIndex + 1;

    if (lastX === nextX && lastY === nextY) {
      return;
    }

    props.moveCard(lastX, lastY, nextX, nextY);
  },
  hover(props, monitor, component) {
    // const { isScrollingTop, isScrollingBottom } = component.state;

    const placeholderIndex = getPlaceholderIndex(
      monitor.getClientOffset().y,
      findDOMNode(component).scrollTop
    );

    // // scroll up inside column
    // if (monitor.isOver() && monitor.getClientOffset().y < 188) {
    //   if (!isScrollingTop) {
    //     component.setState({ isScrollingTop: true });
    //     const scrollingSpeed = 5;

    //     setTimeout(function scrollUp() {
    //       findDOMNode(component).scrollTop -= scrollingSpeed;
    //       if (component.state.isScrollingTop) {
    //         setTimeout(scrollUp, 10);
    //       }
    //     }, 10);
    //   }
    // } else {
    //   component.setState({ isScrollingTop: false });
    // }

    // // scroll down inside column
    // if (monitor.isOver() && monitor.getClientOffset().y > 633) {
    //   if (!isScrollingBottom) {
    //     component.setState({ isScrollingBottom: true });
    //     const scrollingSpeed = 5;

    //     setTimeout(function scrollDown() {
    //       findDOMNode(component).scrollTop += scrollingSpeed;
    //       if (component.state.isScrollingBottom) {
    //         setTimeout(scrollDown, 10);
    //       }
    //     }, 10);
    //   }
    // } else {
    //   component.setState({ isScrollingBottom: false });
    // }

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({ placeholderIndex });

    // when drag begins, we hide the card and only display cardDragPreview
    const item = monitor.getItem();
    document.getElementById(item.id).style.display = 'none';
  }
};


@DropTarget('card', specs, (connectDragSource, monitor) => ({
  connectDropTarget: connectDragSource.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  item: monitor.getItem()
}))
export default class Cards extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    toggleDragging: PropTypes.func,
    cards: PropTypes.array.isRequired,
    x: PropTypes.number.isRequired,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    canDrop: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined,
      isScrolling: false,
    };
  }

  render() {
    const { connectDropTarget, x, cards, isOver, canDrop, toggleDragging } = this.props;
    const { placeholderIndex } = this.state;

    let toPlaceFirst;
    let toPlaceLast;
    let cardList = [];
    cards.forEach((item, i) => {
      toPlaceFirst = false;
      if (isOver && canDrop && i === 0 && placeholderIndex === -1) {
        toPlaceFirst = true;
        cardList.push(<div key="placeholder" className="item placeholder" />);
      }
      if (item !== undefined) {
        cardList.push(
          <Card x={x} y={i}
            item={item}
            key={item.id}
            toggleDragging={toggleDragging}
          />
        );
      }

      if (isOver && canDrop) {
        toPlaceLast = false;
        // if is over current column and being dragged
        // we check if PLACEHOLDER_INDEX is greater than lenght of the array with cards
        // if it is greater, then we change "toPlaceLast" to true and..
        // ..render placeholder as the last element in the column
        // otherwise render it before element with PLACEHOLDER_INDEX
        if (!toPlaceFirst && placeholderIndex > i) {
          toPlaceLast = true;
        } else if (!toPlaceFirst && !toPlaceLast && placeholderIndex === i) {
          cardList.push(<div key="placeholder" className="item placeholder" />);
        }
      }
    });

    // if placeholder index is greater than array.lenght, display placeholder as last
    if (toPlaceLast) {
      cardList.push(<div key="placeholder" className="item placeholder" />);
    }

    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && canDrop && cards.length === 0) {
      cardList.push(<div key="placeholder" className="item placeholder" />);
    }

    return connectDropTarget(
      <div className="desk-items">
        {cardList}
      </div>
    );
  }
}
