/* eslint-env jest */
import React from 'react';
import { shallow, mount } from 'enzyme';

import Toast from './../Toast';
import DefaultCloseButton from './../DefaultCloseButton';
import DefaultTransition from './../DefaultTransition';
import ProgressBar from './../ProgressBar';
import { POSITION } from './../constant';

const REQUIRED_PROPS = {
  closeButton: <DefaultCloseButton />,
  transition: DefaultTransition,
  in: true,
  autoClose: 5000,
  closeToast: () => {},
  position: POSITION.TOP_RIGHT,
  pauseOnHover: true,
  closeOnClick: true
};

describe('Toast', () => {
  it('Should merge container and body className', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
        autoClose={false}
        className="container-class"
        bodyClassName="body-class"
      >
        FooBar
      </Toast>
    );

    expect(component.find('.container-class')).toHaveLength(1);
    expect(component.find('.body-class')).toHaveLength(1);
  });

  it('Should not render ProgressBar if autoClose prop is set to false', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
        autoClose={false}
      >
        FooBar
      </Toast>
    );

    expect(component.children().find(ProgressBar).length).toBe(0);
  });

  it('Should not render closeButton if closeButton prop is set to false',
    () => {
      const component = shallow(
        <Toast
          {...REQUIRED_PROPS}
          closeButton={false}
        >
          FooBar
        </Toast>
      );

      expect(component.children().find(DefaultCloseButton).length).toBe(0);
    });

  it('Can call onOpen callback when component mount', () => {
    const onOpen = jest.fn();
    mount(
      <Toast
        {...REQUIRED_PROPS}
        onOpen={onOpen}
      >
        FooBar
      </Toast>
    ).render();

    expect(onOpen).toHaveBeenCalled();
  });

  it('Can call onClose callback when component will unmount', () => {
    const onClose = jest.fn();
    const component = mount(
      <Toast
        {...REQUIRED_PROPS}
        onClose={onClose}
      >
        FooBar
      </Toast>
    );

    component.unmount();
    expect(onClose).toHaveBeenCalled();
  });

  it('Can pause toast delay on mouse enter', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
      >
        FooBar
      </Toast>
    );
    expect(component.instance().state.isRunning).toBeTruthy();
    component.find('.toastify-content').simulate('mouseEnter');
    expect(component.instance().state.isRunning).toBeFalsy();
  });


  it('Can keep runing on mouse enter', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
        pauseOnHover={false}
      >
        FooBar
      </Toast>
    );
    expect(component.state('isRunning')).toBeTruthy();
    component.find('.toastify-content').simulate('mouseEnter');
    expect(component.state('isRunning')).toBeTruthy();
  });

  it('Should play toast delay on mouse leave', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
      >
        FooBar
      </Toast>
    );

    expect(component.state('isRunning')).toBeTruthy();
    component.find('.toastify-content').simulate('mouseEnter');
    expect(component.state('isRunning')).toBeFalsy();
    component.find('.toastify-content').simulate('mouseLeave');
    expect(component.state('isRunning')).toBeTruthy();
  });

  it('Should not call setState if autoClose prop is false', () => {
    const component = shallow(
      <Toast
        {...REQUIRED_PROPS}
        autoClose={false}
      >
        FooBar
      </Toast>
    );
    expect(component.state('isRunning')).toBeTruthy();
    component.simulate('mouseEnter');
    expect(component.state('isRunning')).toBeTruthy();
  });

  it("Should update state when document visibility change", () => {
    let trigger;
    let event;
  document.addEventListener = (evt, cb) => {
    trigger = cb;
    event = evt;
  }
    
    const component = mount(
      <Toast {...REQUIRED_PROPS}>
      FooBar
    </Toast>
    );
    expect(event).toBe("visibilitychange");
    expect(component.state().isRunning).toBe(true);
    trigger();
    expect(component.state().isRunning).toBe(false);
    
  });
});
