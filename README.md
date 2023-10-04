# Meme Generator Project - TOMEME

## Getting Started
To test the project you should clone the project and run the following commands:

```
npm install
or
yarn install
```

After that you can run the project with the following command:

```
npm start
or
yarn start
```

## Requirements for imgflip API
To use the imgflip `caption_image` API for meme generation you need to create an account and get your own credentials. You can do that here: https://imgflip.com/signup

After that you need to create a .env file in the root of the project and add the following variables:

```
REACT_APP_IMGFLIP_USERNAME=your_username
REACT_APP_IMGFLIP_PASSWORD=your_password
```

## Features
- [x] Display top 100 meme templates
- [x] Ability to search for a specific meme template
- [x] Add text to the meme template
- [x] Position the text
- [x] Resize the text
- [x] Change the color of the text
- [x] Change the font size of the text
- [x] Download generated meme
- [x] Error handling
- [x] Responsive design

## Things to improve
- [ ] Add tests
- [ ] Font size scaling when text is vertically overflown
- [ ] Change text font family
