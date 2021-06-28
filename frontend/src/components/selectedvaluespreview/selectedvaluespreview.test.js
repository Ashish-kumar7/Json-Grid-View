import React from 'react';
import SelectedValues from './SelectedValues';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<SelectedValues />);
});

it('should return a <React.Fragment>', () => {
    expect(shallowWrapper.type().toString()).toEqual(React.Fragment.toString());
});

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(1);
});

// Find the <tbody> element
it('able to find the <tbody> element', () => {
    expect(shallowWrapper.find('tbody').exists()).toEqual(true);
});

//Find the count of <tbody> element
it('able to find the count of <tbody> element', () => {
    expect(shallowWrapper.find('tbody').length).toBe(1);
});

