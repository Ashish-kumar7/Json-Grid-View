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
            classId: PropTypes.string
        });
    });
});

beforeEach(() => {
    shallowWrapper = shallow(<Button title="ButtonTesting" id="123" />);
});
// Find the li element
it('able to find the <li> element', () => {
    expect(shallowWrapper.find('li').exists()).toEqual(false);
});

// Count of li element
it('able to find the count of <li> element', () => {
    expect(shallowWrapper.find('li').length).toBe(0);
});

// Find the link element
it('able to find an <Link> element', () => {
    expect(shallowWrapper.find('Link').exists()).toEqual(false);
});

// Count of link element
it('able to find the count of <Link> element', () => {
    expect(shallowWrapper.find('Link').length).toBe(1);
});
