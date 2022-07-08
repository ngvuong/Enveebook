# Enveebook

A simple Facebook clone built with NextJs. Join the community and connect with people from around the world. View posts from your friends to stay updated and share your stories.

---

[Live Demo](https://enveebook.vercel.app/)

## Features

---

- Create an account with email/password or use facebook auth
- Customize your profile
- Connect with others
- Chat in real time with your friends
- Browse posts from your friends
- Create posts and upload photos
- Comment on posts
- Like your favorite posts and comments
- Remove your own posts and comments

## Technologies

---

- NextJs
- React
- MongoDB (mongoose)
- Next-Auth
- Scss
- Cloudinary
- Firebase
- SWR

## Summary

---

Enveebook is bootstrapped using NextJs with create-next-app and deployed via Vercel. MongoDB with mongoose is used for primary database needs. Models and Schemas data validation uses joi. Realtime chat functionalities and storage are facilitated by Firebase firestore. Authentication is handled by Next-Auth credentials and facebook login. Scss modules are used for styles/layout. Basic dark/light themes are done with next-themes and css variables. Cloudinary is used for all image upload and storage needs. API endpoints on the backend are handled by NextJs's built-in system. Pages use getServerSideProps for session authentication and preliminary data-fetching. State management is done via simple contexts and useState hooks. The SWR package with custom hooks are used as the primary method of data-fetching and updates.

Working with new technologies proved to be challenging, as expected. Using a new framework with its accompanying libraries and tools was a great learning experience with the many unexpected difficulties along the way. Many issues arose out of the various features and peculiarities of the technologies used. One such challenge was getting Next-Auth credentials login to work alongside facebook authentication while using the mongo adapter to be able to save both types of user in one database. Many of these difficulties required deep digging to find solutions and alternatives. Overall, working with NextJs was quite a fun and rewarding experience having learned many lessons.
