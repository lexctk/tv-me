# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.0.8] - 2018-02-17
### Added
- Add delete, edit, update routes for titles
- Add isOwner middleware to limit EDIT/DELETE to title owner
- Add delete, edit, update routes for comments
- Add isCommentOwner middleware

### Changed
- Redirect to original path after login

## [0.0.7] - 2018-02-14
### Added
- Associate new titles and users

## [0.0.6] - 2018-02-14
### Added
- Associate comments and users

## [0.0.5] - 2018-02-13
### Changed
- Refactoring with express router
- Middleware

## [0.0.4] - 2018-02-13
### Added
- Authentication
- Sign Up, Sign In, Sign Out

## [0.0.3] - 2018-02-11
### Changed
- Add comments schema
- Restructure project, create movies and comments folders
- Cleanup code, move models to models folder
- Add readme and changelog
- Change movies SHOW page styling
- Fix footer style
- DB seeding