import React from 'react';
import Button from './Button';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';
import PropTypes from 'prop-types';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

const mockFn = jest.fn();
const consoleErrorSpy = jest.spyOn(global.console, 'error');

jest.mock('prop-types', () => {
    const RealPropTypes = jest.requireActual('prop-types');
    const mockPropTypes = jest.requireActual('mock-prop-types');

    return mockPropTypes(RealPropTypes);
});

describe('ButtonComponent PropType', () => {
    it('exposes the expected propTypes', () => {
        expect(Button.propTypes).toEqual({
            title: PropTypes.string,
            id: PropTypes.string,
            link: PropTypes.string,
            classId: PropTypes.string
        });
    });
});

beforeEach(() => {
    shallowWrapper = shallow(<Button title="ButtonTesting" id="123" />);
});

it('should return a <ul />', () => {
    // const tree = shallow(<Button text="Hello World" />);
    expect(shallowWrapper.type()).toEqual('ul');
});

// Find the li element
it('able to find the <li> element', () => {
    expect(shallowWrapper.find('li').exists()).toEqual(true);
});

// Count of li element
it('able to find the count of <li> element', () => {
    expect(shallowWrapper.find('li').length).toBe(1);
});

// Find the link element
it('able to find an <Link> element', () => {
    expect(shallowWrapper.find('Link').exists()).toEqual(true);
});

// Count of link element
it('able to find the count of <Link> element', () => {
    expect(shallowWrapper.find('Link').length).toBe(1);
});

//button Onclick 
it('should call mock function when button is clicked', () => {
    const tree = shallow(
        <Button name='button test' clickFunc={mockFn} />
    );
    tree.simulate('click');
    expect(mockFn).toHaveBeenCalled();
});

//Props recieved into the button 
it('throws error if given the wrong props', () => {
    shallow(
        <Button
            title={123} id="123" link="/options" classId="classId"
        />
    );
    expect(consoleErrorSpy).toBeCalled();
});
