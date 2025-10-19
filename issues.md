# Project Issues

- [x] The application is stuck on the Nuxt loading screen.
- [x] The "Add New Unit" functionality is not working correctly.
- [x] The "Edit Unit" functionality is not working correctly.
- [x] The `useIsFocused` and `useWindowSize` composables from `@vueuse/core` are being used, but the package is not listed as a dependency.
- [x] The `server/utils/db.ts` file is overly complex and contains a lot of duplicated code.
- [x] The `dev` script in `package.json` does not run the `init-db` script before starting the dev server.
- [x] The `handleSaveUnit` function in `pages/units/index.vue` is not handling the reactivity of the `units` array correctly.
- [x] The `createUnit` and `updateUnit` functions in `server/utils/db.ts` are not returning the data in the correct format.
- [x] The `getSingleWeekStandard`, `createWeekStandard`, `upsertWeekStandards`, `getStandards`, and `updateStandards` functions are missing from `server/utils/db.ts`.
- [ ] Add role-based access control to placements export endpoint.
- [ ] Add specific error handling for bulk upload endpoint.
- [ ] Implement proper error codes for reports endpoint.
- [ ] Improve error messages in standards week operations.
- [ ] Add validation for parent stock input data.
- [ ] Handle CSV parsing errors in placements upload.