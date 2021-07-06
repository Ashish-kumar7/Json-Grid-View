import React from 'react';
import App from './App';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<App />);
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

// Find the <JsonChecker> element
it('able to find the <JsonChecker> element', () => {
    expect(shallowWrapper.find('JsonChecker').exists()).toEqual(true);
});

//Find the count of <JsonChecker> element
it('able to find the count of <JsonChecker> element', () => {
    expect(shallowWrapper.find('JsonChecker').length).toBe(1);
});

// Find the <HomePage> element
it('able to find the <HomePage> element', () => {
    expect(shallowWrapper.find('HomePage').exists()).toEqual(true);
});

//Find the count of <HomePage> element
it('able to find the count of <HomePage> element', () => {
    expect(shallowWrapper.find('HomePage').length).toBe(1);
});

// Find the <OptionsPage> element
it('able to find the <OptionsPage> element', () => {
    expect(shallowWrapper.find('OptionsPage').exists()).toEqual(true);
});

//Find the count of <OptionsPage> element
it('able to find the count of <OptionsPage> element', () => {
    expect(shallowWrapper.find('OptionsPage').length).toBe(1);
});

//Find the <FileUpload> element
it('able to find the <FileUpload> element', () => {
    expect(shallowWrapper.find('FileUpload').exists()).toEqual(true);
});

//Find the count of <FileUpload> element
it('able to find the count of <FileUpload> element', () => {
    expect(shallowWrapper.find('FileUpload').length).toBe(1);
});

//Find the <FileUrl> element
it('able to find the <FileUrl> element', () => {
    expect(shallowWrapper.find('FileUrl').exists()).toEqual(true);
});

//Find the count of <FileUrl> element
it('able to find the count of <FileUrl> element', () => {
    expect(shallowWrapper.find('FileUrl').length).toBe(1);
});

//Find the <JsonInput> element
it('able to find the <JsonInput> element', () => {
    expect(shallowWrapper.find('JsonInput').exists()).toEqual(true);
});

//Find the count of <JsonInput> element
it('able to find the count of <JsonInput> element', () => {
    expect(shallowWrapper.find('JsonInput').length).toBe(1);
});