import React from 'react';
import Footer from './footer';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Footer />);
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
it('able to find the <footer> element', () => {
    expect(shallowWrapper.find('footer').exists()).toEqual(true);
});

// Find the count of the <footer> element.
it('able to find the count of <footer> element', () => {
    expect(shallowWrapper.find('footer').length).toBe(1);
});

// Find the <p> element
it('able to find the <p> element', () => {
    expect(shallowWrapper.find('p').exists()).toEqual(true);
});

//Find the count of <p> element
it('able to find the count of <p> element', () => {
    expect(shallowWrapper.find('p').length).toBe(1);
});

