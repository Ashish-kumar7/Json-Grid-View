import React from 'react';
import IconBox from './iconbox';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';
import PropTypes from 'prop-types';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

const consoleErrorSpy = jest.spyOn(global.console, 'error');

jest.mock('prop-types', () => {
    const RealPropTypes = jest.requireActual('prop-types');
    const mockPropTypes = jest.requireActual('mock-prop-types');

    return mockPropTypes(RealPropTypes);
});

describe('IconBoxComponent PropType', () => {
    it('exposes the expected propTypes', () => {
        expect(IconBox.propTypes).toEqual({
            size: PropTypes.string
        });
    });
});

beforeEach(() => {
    shallowWrapper = shallow(<IconBox />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(1);
});

// Find the <Link> element
it('able to find the <Link> element', () => {
    expect(shallowWrapper.find('Link').exists()).toEqual(true);
});

// Find the count of the <Link> element.
it('able to find the count of <Link> element', () => {
    expect(shallowWrapper.find('Link').length).toBe(1);
});

// Find the <FontAwesomeIcon> element
it('able to find the <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').exists()).toEqual(true);
});

//Find the count of <FontAwesomeIcon> element
it('able to find the count of <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').length).toBe(1);
});

//Props recieved into the button 
it('throws error if given the wrong props', () => {
    shallow(
        <IconBox
            size={123}
        />
    );
    expect(consoleErrorSpy).toBeCalled();
});
