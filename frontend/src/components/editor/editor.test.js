import React from 'react';
import Editor from './editor';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Editor />);
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

// Find the <textarea> element
it('able to find the <textarea> element', () => {
    expect(shallowWrapper.find('textarea').exists()).toEqual(true);
});

// Find the count of the <textarea> element.
it('able to find the count of <textarea> element', () => {
    expect(shallowWrapper.find('textarea').length).toBe(1);
});



