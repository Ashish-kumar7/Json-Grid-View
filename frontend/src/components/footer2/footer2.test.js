import React from 'react';
import Footer2 from './footer2';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Footer2 />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the text of <p> element
it('able to find the text of <p> element ', () => {
    expect(shallowWrapper.find('p').text()).toEqual('Copyright © 2021.');
})

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(5);
});

// Find the <footer> element
it('able to find the <footer2> element', () => {
    expect(shallowWrapper.find('footer2').exists()).toEqual(true);
});

// Find the count of the <footer> element.
it('able to find the count of <footer2> element', () => {
    expect(shallowWrapper.find('footer2').length).toBe(1);
});

// Find the <p> element
it('able to find the <p> element', () => {
    expect(shallowWrapper.find('p').exists()).toEqual(true);
});

//Find the count of <p> element
it('able to find the count of <p> element', () => {
    expect(shallowWrapper.find('p').length).toBe(1);
});

