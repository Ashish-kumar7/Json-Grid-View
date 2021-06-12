import React from 'react';
import SocialIcons from './socialicons';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<SocialIcons />);
});

// error  part
it('should return a <div>', () => {
    expect(shallowWrapper.type().toString()).toEqual(React.Fragment.toString());
});

// Find the <span> element
it('able to find the <span> element', () => {
    expect(shallowWrapper.find('span').exists()).toEqual(true);
});

// Find the count of the <span> element.
it('able to find the count of <span> element', () => {
    expect(shallowWrapper.find('span').length).toBe(5); 
});

// Find the <Link> element
it('able to find the <Link> element', () => {
    expect(shallowWrapper.find('Link').exists()).toEqual(true);
});

//Find the count of <Link> element
it('able to find the count of <Link> element', () => {
    expect(shallowWrapper.find('Link').length).toBe(5);
});

// Find the <FontAwesomeIcon> element
it('able to find the <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').exists()).toEqual(true);
});

//Find the count of <FontAwesomeIcon> element
it('able to find the count of <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').length).toBe(5);
});
