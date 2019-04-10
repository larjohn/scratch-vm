// const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const mqtt = require('mqtt');
// const AsyncClient = require('async-mqtt').AsyncClient;


/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MCA0MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiM3NUE5Mjg7fS5zdDF7ZmlsbDojQkMxMTQyO308L3N0eWxlPjxnPjxwYXRoIGQ9Ik0xMy43LDIuNGMtMC4yLDAtMC40LDAuMS0wLjYsMC4yYy0wLjUtMC4yLTEtMC4zLTEuNSwwLjFjLTAuNy0wLjEtMC45LDAuMS0xLjEsMC4zYy0wLjIsMC0xLjItMC4yLTEuNiwwLjVDNy43LDMuNSw3LjMsNC40LDcuNyw1LjFDNy41LDUuNSw3LjMsNS45LDcuOCw2LjZDNy42LDcsNy43LDcuNCw4LjIsNy45QzguMSw4LjUsOC4zLDguOCw4LjcsOS4xYy0wLjEsMC44LDAuNywxLjIsMC45LDEuM2MwLjEsMC40LDAuMywwLjksMS4yLDEuMWMwLjEsMC43LDAuNywwLjgsMS4yLDAuOWMtMS43LDEtMy4xLDIuMy0zLjEsNS41bC0wLjIsMC40Yy0xLjksMS4yLTMuNyw1LTEsOC4xYzAuMiwxLDAuNSwxLjcsMC43LDIuNGMwLjQsMy4xLDMsNC41LDMuNyw0LjdjMSwwLjgsMi4xLDEuNSwzLjUsMmMxLjQsMS40LDIuOCwxLjksNC4zLDEuOWMwLDAsMCwwLDAuMSwwYzEuNSwwLDMtMC41LDQuMy0xLjljMS41LTAuNSwyLjUtMS4yLDMuNS0yYzAuNy0wLjIsMy4zLTEuNiwzLjctNC43YzAuMy0wLjgsMC42LTEuNSwwLjctMi40YzIuNy0zLjEsMS02LjktMS04LjFsLTAuMi0wLjRjMC0zLjItMS40LTQuNS0zLjEtNS41YzAuNS0wLjEsMS0wLjMsMS4yLTAuOWMwLjktMC4yLDEuMS0wLjYsMS4yLTEuMWMwLjItMC4yLDEtMC42LDAuOS0xLjNjMC40LTAuMywwLjctMC43LDAuNi0xLjJjMC41LTAuNSwwLjYtMC45LDAuNC0xLjNjMC42LTAuNywwLjMtMS4xLDAuMS0xLjRjMC40LTAuOCwwLTEuNi0xLjEtMS41Yy0wLjUtMC43LTEuNS0wLjUtMS42LTAuNWMtMC4yLTAuMi0wLjQtMC40LTEuMS0wLjNjLTAuNS0wLjQtMS0wLjMtMS41LTAuMWMtMC42LTAuNS0xLTAuMS0xLjUsMC4xYy0wLjgtMC4yLTAuOSwwLjEtMS4zLDAuMmMtMC44LTAuMi0xLjEsMC4yLTEuNSwwLjZsLTAuNSwwYy0xLjMsMC43LTEuOSwyLjItMi4xLDNjLTAuMi0wLjgtMC44LTIuMy0yLjEtM2wtMC41LDBDMTcsMy4yLDE2LjgsMi44LDE1LjksM2MtMC40LTAuMS0wLjUtMC41LTEuMy0wLjJDMTQuMywyLjYsMTQsMi40LDEzLjcsMi40eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMS4yLDUuN2MzLjMsMS43LDUuMywzLjEsNi4zLDQuM2MtMC41LDIuMi0zLjQsMi4zLTQuNCwyLjJjMC4yLTAuMSwwLjQtMC4yLDAuNS0wLjRjLTAuMy0wLjItMS4yLDAtMS44LTAuNGMwLjItMC4xLDAuNC0wLjEsMC41LTAuM2MtMC42LTAuMi0xLjMtMC40LTEuNi0wLjdjMC4yLDAsMC40LDAsMC43LTAuMWMtMC41LTAuMy0xLjEtMC41LTEuNi0xYzAuMywwLDAuNiwwLDAuNy0wLjFjLTAuNS0wLjMtMC45LTAuNy0xLjMtMWMwLjQsMCwwLjYsMCwwLjctMC4xQzkuMyw3LjgsOC45LDcuNCw4LjYsN2MwLjMsMC4xLDAuNiwwLjEsMC44LDBjLTAuMS0wLjMtMC43LTAuNS0xLTEuMWMwLjMsMCwwLjYsMC4xLDAuNywwQzksNS4yLDguNyw0LjksOC41LDQuNmMwLjcsMCwxLjcsMCwxLjYtMC4xTDkuNyw0LjFjMC42LTAuMiwxLjMsMCwxLjgsMC4yYzAuMi0wLjIsMC0wLjQtMC4zLTAuNmMwLjUsMC4xLDEsMC4yLDEuNSwwLjRjMC4yLTAuMi0wLjItMC40LTAuMy0wLjZjMC44LDAuMiwxLjIsMC40LDEuNiwwLjZjMC4zLTAuMiwwLTAuNS0wLjItMC43YzAuNiwwLjIsMSwwLjUsMS4zLDAuOGMwLjEtMC4yLDAuMy0wLjMsMC4xLTAuN2MwLjUsMC4zLDAuOCwwLjYsMSwwLjljMC4zLTAuMiwwLjItMC40LDAuMi0wLjZjMC41LDAuNCwwLjgsMC44LDEuMSwxLjJjMC4xLTAuMSwwLjEtMC4yLDAuMi0wLjVjMS4xLDEuMSwyLjcsMy44LDAuNCw0LjlDMTYuMSw3LjgsMTMuOCw2LjYsMTEuMiw1Ljd6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI4LjksNS43Yy0zLjMsMS43LTUuMywzLjEtNi4zLDQuM2MwLjUsMi4yLDMuNCwyLjMsNC40LDIuMmMtMC4yLTAuMS0wLjQtMC4yLTAuNS0wLjRjMC4zLTAuMiwxLjIsMCwxLjgtMC40Yy0wLjItMC4xLTAuNC0wLjEtMC41LTAuM2MwLjYtMC4yLDEuMy0wLjQsMS42LTAuN2MtMC4yLDAtMC40LDAtMC43LTAuMWMwLjUtMC4zLDEuMS0wLjUsMS42LTFjLTAuMywwLTAuNiwwLTAuNy0wLjFjMC41LTAuMywwLjktMC43LDEuMy0xYy0wLjQsMC0wLjYsMC0wLjctMC4xYzAuNC0wLjQsMC45LTAuNywxLjEtMS4yYy0wLjMsMC4xLTAuNiwwLjEtMC44LDBjMC4xLTAuMywwLjctMC41LDEtMS4xYy0wLjMsMC0wLjYsMC4xLTAuNywwYzAuMS0wLjYsMC40LTAuOSwwLjYtMS4zYy0wLjcsMC0xLjcsMC0xLjYtMC4xbDAuNC0wLjRjLTAuNi0wLjItMS4zLDAtMS44LDAuMmMtMC4yLTAuMiwwLTAuNCwwLjMtMC42Yy0wLjUsMC4xLTEsMC4yLTEuNSwwLjRjLTAuMi0wLjIsMC4yLTAuNCwwLjMtMC42Yy0wLjgsMC4yLTEuMiwwLjQtMS42LDAuNmMtMC4zLTAuMiwwLTAuNSwwLjItMC43Yy0wLjYsMC4yLTEsMC41LTEuMywwLjhjLTAuMS0wLjItMC4zLTAuMy0wLjEtMC43Yy0wLjUsMC4zLTAuOCwwLjYtMSwwLjljLTAuMy0wLjItMC4yLTAuNC0wLjItMC42QzIzLjMsNC4yLDIzLDQuNiwyMi42LDVjLTAuMS0wLjEtMC4xLTAuMi0wLjItMC41Yy0xLjEsMS4xLTIuNywzLjgtMC40LDQuOUMyMy45LDcuOCwyNi4zLDYuNiwyOC45LDUuN0wyOC45LDUuN3oiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQuMSwyNy45YzAsMi0xLjgsMy43LTQsMy43Yy0yLjIsMC00LTEuNi00LTMuN3MxLjgtMy43LDQtMy43QzIyLjMsMjQuMiwyNC4xLDI1LjksMjQuMSwyNy45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNy44LDE3LjRjMS43LDEuMSwyLDMuNSwwLjcsNS41Yy0xLjMsMS45LTMuNywyLjYtNS4zLDEuNmwwLDBjLTEuNy0xLjEtMi0zLjUtMC43LTUuNVMxNi4xLDE2LjMsMTcuOCwxNy40TDE3LjgsMTcuNHoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIuMiwxNy4yYy0xLjcsMS4xLTIsMy41LTAuNyw1LjVjMS4zLDEuOSwzLjcsMi42LDUuMywxLjZsMCwwYzEuNy0xLjEsMi0zLjUsMC43LTUuNVMyMy45LDE2LjEsMjIuMiwxNy4yTDIyLjIsMTcuMnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNOS41LDE5LjFjMS44LTAuNSwwLjYsNy40LTAuOSw2LjdDNy4xLDI0LjYsNi41LDIwLjgsOS41LDE5LjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTMwLjEsMTljLTEuOC0wLjUtMC42LDcuNCwwLjksNi43QzMyLjYsMjQuNSwzMy4xLDIwLjcsMzAuMSwxOXoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQuMSwxMy4yYzMuMS0wLjUsNS42LDEuMyw1LjUsNC43QzI5LjUsMTkuMSwyMi45LDEzLjQsMjQuMSwxMy4yTDI0LjEsMTMuMnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTUuNiwxMy4xYy0zLjEtMC41LTUuNiwxLjMtNS41LDQuN0MxMC4xLDE5LDE2LjcsMTMuMywxNS42LDEzLjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTIwLDEyLjNjLTEuOCwwLTMuNiwxLjQtMy42LDIuMmMwLDEsMS41LDIsMy42LDJjMi4yLDAsMy42LTAuOCwzLjYtMS44QzIzLjYsMTMuNSwyMS42LDEyLjMsMjAsMTIuM0wyMCwxMi4zeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMC4xLDMyLjdjMS42LTAuMSwzLjgsMC41LDMuOCwxLjNjMCwwLjgtMiwyLjUtMy45LDIuNGMtMiwwLjEtMy45LTEuNi0zLjktMi4yQzE2LjEsMzMuNCwxOC41LDMyLjcsMjAuMSwzMi43eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNC4yLDI4LjFjMS4xLDEuNCwxLjcsMy44LDAuNyw0LjVjLTAuOSwwLjUtMy4xLDAuMy00LjYtMS45Yy0xLTEuOS0wLjktMy44LTAuMi00LjNDMTEuMiwyNS43LDEyLjksMjYuNiwxNC4yLDI4LjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI1LjgsMjcuN2MtMS4yLDEuNC0xLjksNC4xLTEsNC45YzAuOSwwLjcsMy4yLDAuNiw0LjktMS44YzEuMi0xLjYsMC44LTQuMywwLjEtNUMyOC43LDI1LDI3LjIsMjYuMSwyNS44LDI3Ljd6Ii8+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MCA0MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiM3NUE5Mjg7fS5zdDF7ZmlsbDojQkMxMTQyO308L3N0eWxlPjxnPjxwYXRoIGQ9Ik0xMy43LDIuNGMtMC4yLDAtMC40LDAuMS0wLjYsMC4yYy0wLjUtMC4yLTEtMC4zLTEuNSwwLjFjLTAuNy0wLjEtMC45LDAuMS0xLjEsMC4zYy0wLjIsMC0xLjItMC4yLTEuNiwwLjVDNy43LDMuNSw3LjMsNC40LDcuNyw1LjFDNy41LDUuNSw3LjMsNS45LDcuOCw2LjZDNy42LDcsNy43LDcuNCw4LjIsNy45QzguMSw4LjUsOC4zLDguOCw4LjcsOS4xYy0wLjEsMC44LDAuNywxLjIsMC45LDEuM2MwLjEsMC40LDAuMywwLjksMS4yLDEuMWMwLjEsMC43LDAuNywwLjgsMS4yLDAuOWMtMS43LDEtMy4xLDIuMy0zLjEsNS41bC0wLjIsMC40Yy0xLjksMS4yLTMuNyw1LTEsOC4xYzAuMiwxLDAuNSwxLjcsMC43LDIuNGMwLjQsMy4xLDMsNC41LDMuNyw0LjdjMSwwLjgsMi4xLDEuNSwzLjUsMmMxLjQsMS40LDIuOCwxLjksNC4zLDEuOWMwLDAsMCwwLDAuMSwwYzEuNSwwLDMtMC41LDQuMy0xLjljMS41LTAuNSwyLjUtMS4yLDMuNS0yYzAuNy0wLjIsMy4zLTEuNiwzLjctNC43YzAuMy0wLjgsMC42LTEuNSwwLjctMi40YzIuNy0zLjEsMS02LjktMS04LjFsLTAuMi0wLjRjMC0zLjItMS40LTQuNS0zLjEtNS41YzAuNS0wLjEsMS0wLjMsMS4yLTAuOWMwLjktMC4yLDEuMS0wLjYsMS4yLTEuMWMwLjItMC4yLDEtMC42LDAuOS0xLjNjMC40LTAuMywwLjctMC43LDAuNi0xLjJjMC41LTAuNSwwLjYtMC45LDAuNC0xLjNjMC42LTAuNywwLjMtMS4xLDAuMS0xLjRjMC40LTAuOCwwLTEuNi0xLjEtMS41Yy0wLjUtMC43LTEuNS0wLjUtMS42LTAuNWMtMC4yLTAuMi0wLjQtMC40LTEuMS0wLjNjLTAuNS0wLjQtMS0wLjMtMS41LTAuMWMtMC42LTAuNS0xLTAuMS0xLjUsMC4xYy0wLjgtMC4yLTAuOSwwLjEtMS4zLDAuMmMtMC44LTAuMi0xLjEsMC4yLTEuNSwwLjZsLTAuNSwwYy0xLjMsMC43LTEuOSwyLjItMi4xLDNjLTAuMi0wLjgtMC44LTIuMy0yLjEtM2wtMC41LDBDMTcsMy4yLDE2LjgsMi44LDE1LjksM2MtMC40LTAuMS0wLjUtMC41LTEuMy0wLjJDMTQuMywyLjYsMTQsMi40LDEzLjcsMi40eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMS4yLDUuN2MzLjMsMS43LDUuMywzLjEsNi4zLDQuM2MtMC41LDIuMi0zLjQsMi4zLTQuNCwyLjJjMC4yLTAuMSwwLjQtMC4yLDAuNS0wLjRjLTAuMy0wLjItMS4yLDAtMS44LTAuNGMwLjItMC4xLDAuNC0wLjEsMC41LTAuM2MtMC42LTAuMi0xLjMtMC40LTEuNi0wLjdjMC4yLDAsMC40LDAsMC43LTAuMWMtMC41LTAuMy0xLjEtMC41LTEuNi0xYzAuMywwLDAuNiwwLDAuNy0wLjFjLTAuNS0wLjMtMC45LTAuNy0xLjMtMWMwLjQsMCwwLjYsMCwwLjctMC4xQzkuMyw3LjgsOC45LDcuNCw4LjYsN2MwLjMsMC4xLDAuNiwwLjEsMC44LDBjLTAuMS0wLjMtMC43LTAuNS0xLTEuMWMwLjMsMCwwLjYsMC4xLDAuNywwQzksNS4yLDguNyw0LjksOC41LDQuNmMwLjcsMCwxLjcsMCwxLjYtMC4xTDkuNyw0LjFjMC42LTAuMiwxLjMsMCwxLjgsMC4yYzAuMi0wLjIsMC0wLjQtMC4zLTAuNmMwLjUsMC4xLDEsMC4yLDEuNSwwLjRjMC4yLTAuMi0wLjItMC40LTAuMy0wLjZjMC44LDAuMiwxLjIsMC40LDEuNiwwLjZjMC4zLTAuMiwwLTAuNS0wLjItMC43YzAuNiwwLjIsMSwwLjUsMS4zLDAuOGMwLjEtMC4yLDAuMy0wLjMsMC4xLTAuN2MwLjUsMC4zLDAuOCwwLjYsMSwwLjljMC4zLTAuMiwwLjItMC40LDAuMi0wLjZjMC41LDAuNCwwLjgsMC44LDEuMSwxLjJjMC4xLTAuMSwwLjEtMC4yLDAuMi0wLjVjMS4xLDEuMSwyLjcsMy44LDAuNCw0LjlDMTYuMSw3LjgsMTMuOCw2LjYsMTEuMiw1Ljd6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI4LjksNS43Yy0zLjMsMS43LTUuMywzLjEtNi4zLDQuM2MwLjUsMi4yLDMuNCwyLjMsNC40LDIuMmMtMC4yLTAuMS0wLjQtMC4yLTAuNS0wLjRjMC4zLTAuMiwxLjIsMCwxLjgtMC40Yy0wLjItMC4xLTAuNC0wLjEtMC41LTAuM2MwLjYtMC4yLDEuMy0wLjQsMS42LTAuN2MtMC4yLDAtMC40LDAtMC43LTAuMWMwLjUtMC4zLDEuMS0wLjUsMS42LTFjLTAuMywwLTAuNiwwLTAuNy0wLjFjMC41LTAuMywwLjktMC43LDEuMy0xYy0wLjQsMC0wLjYsMC0wLjctMC4xYzAuNC0wLjQsMC45LTAuNywxLjEtMS4yYy0wLjMsMC4xLTAuNiwwLjEtMC44LDBjMC4xLTAuMywwLjctMC41LDEtMS4xYy0wLjMsMC0wLjYsMC4xLTAuNywwYzAuMS0wLjYsMC40LTAuOSwwLjYtMS4zYy0wLjcsMC0xLjcsMC0xLjYtMC4xbDAuNC0wLjRjLTAuNi0wLjItMS4zLDAtMS44LDAuMmMtMC4yLTAuMiwwLTAuNCwwLjMtMC42Yy0wLjUsMC4xLTEsMC4yLTEuNSwwLjRjLTAuMi0wLjIsMC4yLTAuNCwwLjMtMC42Yy0wLjgsMC4yLTEuMiwwLjQtMS42LDAuNmMtMC4zLTAuMiwwLTAuNSwwLjItMC43Yy0wLjYsMC4yLTEsMC41LTEuMywwLjhjLTAuMS0wLjItMC4zLTAuMy0wLjEtMC43Yy0wLjUsMC4zLTAuOCwwLjYtMSwwLjljLTAuMy0wLjItMC4yLTAuNC0wLjItMC42QzIzLjMsNC4yLDIzLDQuNiwyMi42LDVjLTAuMS0wLjEtMC4xLTAuMi0wLjItMC41Yy0xLjEsMS4xLTIuNywzLjgtMC40LDQuOUMyMy45LDcuOCwyNi4zLDYuNiwyOC45LDUuN0wyOC45LDUuN3oiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQuMSwyNy45YzAsMi0xLjgsMy43LTQsMy43Yy0yLjIsMC00LTEuNi00LTMuN3MxLjgtMy43LDQtMy43QzIyLjMsMjQuMiwyNC4xLDI1LjksMjQuMSwyNy45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNy44LDE3LjRjMS43LDEuMSwyLDMuNSwwLjcsNS41Yy0xLjMsMS45LTMuNywyLjYtNS4zLDEuNmwwLDBjLTEuNy0xLjEtMi0zLjUtMC43LTUuNVMxNi4xLDE2LjMsMTcuOCwxNy40TDE3LjgsMTcuNHoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIuMiwxNy4yYy0xLjcsMS4xLTIsMy41LTAuNyw1LjVjMS4zLDEuOSwzLjcsMi42LDUuMywxLjZsMCwwYzEuNy0xLjEsMi0zLjUsMC43LTUuNVMyMy45LDE2LjEsMjIuMiwxNy4yTDIyLjIsMTcuMnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNOS41LDE5LjFjMS44LTAuNSwwLjYsNy40LTAuOSw2LjdDNy4xLDI0LjYsNi41LDIwLjgsOS41LDE5LjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTMwLjEsMTljLTEuOC0wLjUtMC42LDcuNCwwLjksNi43QzMyLjYsMjQuNSwzMy4xLDIwLjcsMzAuMSwxOXoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQuMSwxMy4yYzMuMS0wLjUsNS42LDEuMyw1LjUsNC43QzI5LjUsMTkuMSwyMi45LDEzLjQsMjQuMSwxMy4yTDI0LjEsMTMuMnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTUuNiwxMy4xYy0zLjEtMC41LTUuNiwxLjMtNS41LDQuN0MxMC4xLDE5LDE2LjcsMTMuMywxNS42LDEzLjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTIwLDEyLjNjLTEuOCwwLTMuNiwxLjQtMy42LDIuMmMwLDEsMS41LDIsMy42LDJjMi4yLDAsMy42LTAuOCwzLjYtMS44QzIzLjYsMTMuNSwyMS42LDEyLjMsMjAsMTIuM0wyMCwxMi4zeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMC4xLDMyLjdjMS42LTAuMSwzLjgsMC41LDMuOCwxLjNjMCwwLjgtMiwyLjUtMy45LDIuNGMtMiwwLjEtMy45LTEuNi0zLjktMi4yQzE2LjEsMzMuNCwxOC41LDMyLjcsMjAuMSwzMi43eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNC4yLDI4LjFjMS4xLDEuNCwxLjcsMy44LDAuNyw0LjVjLTAuOSwwLjUtMy4xLDAuMy00LjYtMS45Yy0xLTEuOS0wLjktMy44LTAuMi00LjNDMTEuMiwyNS43LDEyLjksMjYuNiwxNC4yLDI4LjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI1LjgsMjcuN2MtMS4yLDEuNC0xLjksNC4xLTEsNC45YzAuOSwwLjcsMy4yLDAuNiw0LjktMS44YzEuMi0xLjYsMC44LTQuMywwLjEtNUMyOC43LDI1LDI3LjIsMjYuMSwyNS44LDI3Ljd6Ii8+PC9nPjwvc3ZnPg==';


const SensorType = {
    TILT: 'Tilt Switch',
    PROXIMITY: 'Proximity Sensor',
    SWITCH: 'Generic Switch',
    HALL: 'Hall Effect Sensor'

};

const SwitchStates = {
    FALSE: 'on',
    TRUE: 'off'
};

const MotorBank = {
    A: 'A',
    B: 'B'

};

const BipolarMotorDirection = {
    CW: '1',
    CCW: '-1'

};

/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3RpiBlocks {


    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.devices = {};
        this.clients = {};
        /**
         * The motion detection algoritm used to power the motion amount and
         * direction values.
         * @type {VideoMotion}
         */
        //  this.detect = new VideoMotion();

        /**
         * The last millisecond epoch timestamp that the video stream was
         * analyzed.
         * @type {number}
         */
        //  this._lastUpdate = null;

        /**
         * A flag to determine if this extension has been installed in a project.
         * It is set to false the first time getInfo is run.
         * @type {boolean}
         */
        //  this.firstInstall = true;

        if (this.runtime.ioDevices) {
            // Configure the video device with values from globally stored locations.
            //   this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this));

            // Clear target motion state values when the project starts.
            //    this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));

            // Kick off looping the analysis logic.
            // this._loop();
        }
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {

        // Return extension definition
        return {
            id: 'rpi',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            name: 'Raspberry Pi',

            blocks: [
                {
                    opcode: 'hello-pi',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect to [DEVICE_NAME] on address [ADDRESS]:[PORT]',
                    func: 'helloPi',
                    arguments: {

                        ADDRESS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'raspberrypi.local'
                        },
                        PORT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9001
                        },
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        }
                    }
                },
                {
                    opcode: 'hello-sensor-1',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect [SENSORTYPE] [SENSOR_NAME]at gpio[PIN] of [DEVICE_NAME]',
                    func: 'helloSensor1',
                    arguments: {
                        SENSORTYPE: {
                            type: ArgumentType.STRING,
                            menu: 'sensorTypes',
                            defaultValue: SensorType.SWITCH
                        },
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 26
                        },
                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Sensor1'
                        }
                    }
                },
                {
                    opcode: 'hello-analog-sensor',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect PCF8591 [SENSOR_NAME]at address[ADDR] of [DEVICE_NAME]',
                    func: 'helloAnalog',
                    arguments: {
                        SENSORTYPE: {
                            type: ArgumentType.STRING,
                            menu: 'sensorTypes',
                            defaultValue: SensorType.HALL
                        },
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: '0x48'
                        },
                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'AnalogSensor1'
                        }
                    }
                },
                {
                    opcode: 'hello-fng-motor',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect TB6612FNG[MOTORBLOCK_NAME] AIN1[AIN1], AIN2[AIN2], BIN1[BIN1], BIN2[BIN2], PWMA[PWMA], PWMB[PWMB], STBY[STBY] of [DEVICE_NAME] and call MotorA[MOTORA_NAME], Motor B[MOTORB_NAME] ',
                    func: 'hellofng',
                    arguments: {
                        AIN1: {
                            type: ArgumentType.STRING,
                            defaultValue: 23
                        },
                        AIN2: {
                            type: ArgumentType.STRING,
                            defaultValue: 24
                        },

                        PWMA: {
                            type: ArgumentType.STRING,
                            defaultValue: 25
                        },

                        BIN1: {
                            type: ArgumentType.STRING,
                            defaultValue: 19
                        },
                        BIN2: {
                            type: ArgumentType.STRING,
                            defaultValue: 20
                        },

                        PWMB: {
                            type: ArgumentType.STRING,
                            defaultValue: 21
                        },
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        MOTORA_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'MotorA'
                        },
                        MOTORB_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'MotorB'
                        },
                        MOTORBLOCK_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'MotorBlock'
                        },
                        STBY: {
                            type: ArgumentType.STRING,
                            defaultValue: '13'
                        }
                    }
                },
                {
                    opcode: 'hello-bipolar-motor',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect DRV8825[BIPOLAR_MOTOR_NAME] STP[STP], SLEEP[SLEEP], DIR[DIR] of [DEVICE_NAME]',
                    func: 'hellobipolar',
                    arguments: {
                        STP: {
                            type: ArgumentType.STRING,
                            defaultValue: 23
                        },
                        SLEEP: {
                            type: ArgumentType.STRING,
                            defaultValue: 24
                        },

                        DIR: {
                            type: ArgumentType.STRING,
                            defaultValue: 25
                        },


                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        BIPOLAR_MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'BipolarMotor'
                        }

                    }
                },

                {
                    opcode: 'hello-fng-motor-single',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect TB6612FNG[MOTORSLOT] IN1:[IN1] IN2:[IN2] PWM:[PWM] STBY:[STBY] of [DEVICE_NAME] and call it [MOTOR_NAME]',
                    func: 'hellofngsingle',
                    arguments: {
                        MOTORSLOT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'A',
                            menu: 'MOTORBANKS'
                        },
                        IN1: {
                            type: ArgumentType.STRING,
                            defaultValue: 17
                        },
                        IN2: {
                            type: ArgumentType.STRING,
                            defaultValue: 18
                        },

                        PWM: {
                            type: ArgumentType.STRING,
                            defaultValue: 15
                        },


                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Motor1'
                        },

                        STBY: {
                            type: ArgumentType.STRING,
                            defaultValue: '14'
                        }
                    }
                },

                {
                    opcode: 'hello-uln-stepper',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'connect ULN2003 stepper [STEPPERA_NAME] IN1:[IN1] IN2:[IN2] IN3:[IN3] IN4:[IN4] of [DEVICE_NAME]',
                    func: 'hellouln',
                    arguments: {
                        IN1: {
                            type: ArgumentType.STRING,
                            defaultValue: 22
                        },
                        IN2: {
                            type: ArgumentType.STRING,
                            defaultValue: 23
                        },

                        IN3: {
                            type: ArgumentType.STRING,
                            defaultValue: 24
                        },
                        IN4: {
                            type: ArgumentType.STRING,
                            defaultValue: 25
                        },


                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        STEPPERA_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'StepperA'
                        }

                    }
                },


                {
                    opcode: 'led-light',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'switch LED light at gpio [PIN] of [DEVICE_NAME] to power [POWER]',
                    func: 'powerLED',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 17
                        },
                        POWER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'motor-power',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'set Motor [MOTOR_NAME] of [DEVICE_NAME] to power [POWER]',
                    func: 'powerMotor',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Motor1'
                        },
                        POWER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'bipolar-motor-power',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'turn Bipolar Motor [BIPOLAR_MOTOR_NAME] of [DEVICE_NAME] direction [DIR] steps [STP]',
                    func: 'powerBipolarMotor',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        BIPOLAR_MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'BipolarMotor'
                        },
                        STP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        DIR: {
                            type: ArgumentType.STRING,
                            defaultValue: BipolarMotorDirection.CW,
                            menu: 'BIPOLARMOTORDIRECTIONS'

                        }
                    }
                },

                {
                    opcode: 'stepper-power',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'set stepper motor [STEPPER_NAME] of [DEVICE_NAME] to delay [DELAY] and steps [STEPS]',
                    func: 'powerStepper',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        STEPPER_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'StepperA'
                        },
                        DELAY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },

                {
                    opcode: 'motor-brake',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'brake Motor [MOTOR_NAME] of [DEVICE_NAME]',
                    func: 'brakeMotor',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Motor1'
                        }

                    }
                },
                {
                    opcode: 'motor-unbrake',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: 'release the brake of Motor [MOTOR_NAME] of [DEVICE_NAME]',
                    func: 'unbrakeMotor',
                    arguments: {
                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },
                        MOTOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Motor1'
                        }

                    }
                },
                {
                    opcode: 'whenTilted',
                    blockType: BlockType.HAT,
                    func: 'whenTilted',
                    text: 'when [SENSOR_NAME] of [DEVICE_NAME] is tilted',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'tiltSensor'
                        },
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'any'
                        }
                    }

                },
                {
                    opcode: 'isTilted',
                    blockType: BlockType.BOOLEAN,
                    text: 'tilt sensor [SENSOR_NAME] of [DEVICE_NAME] tilted?',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'tiltSensor'
                        }
                    },
                    func: 'isTilted'
                },
                {
                    opcode: 'whenSwitched',
                    blockType: BlockType.HAT,
                    func: 'whenSwitched',
                    text: 'when [SENSOR_NAME] of [DEVICE_NAME] is switched to [STATE]',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'switchSensor'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            defaultValue: SwitchStates.FALSE,
                            menu: 'SWITCHSTATES'

                        }
                    }

                },
                {
                    opcode: 'isSwitched',
                    blockType: BlockType.BOOLEAN,
                    text: 'switch sensor [SENSOR_NAME] of [DEVICE_NAME] switched?',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'switchSensor'
                        }
                    },
                    func: 'isSwitched'
                },
                {
                    opcode: 'readAnalog',
                    blockType: BlockType.REPORTER,
                    text: 'value [CHANNEL] of sensor [SENSOR_NAME] at [DEVICE_NAME]',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'AnalogSensor1'
                        },

                        CHANNEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    func: 'readAnalog'
                },
                {
                    opcode: 'isProximal',
                    blockType: BlockType.BOOLEAN,
                    text: 'any object near the proximity sensor [SENSOR_NAME] of [DEVICE_NAME]?',
                    arguments: {

                        DEVICE_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rpi1'
                        },

                        SENSOR_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'proximitySensor'
                        }
                    },
                    func: 'isProximal'
                }
            ],
            menus: {
                sensorTypes: [SensorType.TILT, SensorType.PROXIMITY, SensorType.SWITCH],
                MOTORBANKS: [MotorBank.A, MotorBank.B],
                SWITCHSTATES: [SwitchStates.TRUE, SwitchStates.FALSE],
                BIPOLARMOTORDIRECTIONS: [BipolarMotorDirection.CW, BipolarMotorDirection.CCW]

            },
            // translations
            translation_map: {
                fr: {
                    'extensionName': 'Raspberry Pi',
                    'notification-show': 'Nouveau Notification titre [TITLE] soustitre [CONTENT] image [IMAGE]',
                    'notification-show.TITLE_default': 'Bonjour, Monde!',
                    'notification-show.CONTENT_default': 'Je suis un notification.',
                    'notification-permitted': 'RaspberryPi Permission?'
                }
            }
        };
    }


    helloPi (args) {
        this.devices[args.DEVICE_NAME] = {address: args.ADDRESS, port: args.PORT, state: {}};


        const client = mqtt.connect({host: args.ADDRESS, port: args.PORT});
        client.subscribe('rpi/devices/sensors/#');


        this.clients[args.DEVICE_NAME] = client;


    }


    /**
     * Implement myReporter.
     * @param {object} args - the block's arguments.
     * @property {number} LETTER_NUM - the string value of the argument.
     * @property {string} TEXT - the string value of the argument.
     */
    helloSensor1 (args) {
        const self = this;
        const client = this.clients[args.DEVICE_NAME];
        if (args.SENSORTYPE === SensorType.TILT) {
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] = {tilted: false};
            this.clients[args.DEVICE_NAME].publish('rpi/subscription',
                JSON.stringify({
                    command: 'SUBSCRIBE',
                    args: {ALIAS: args.SENSOR_NAME, DEVICE: 'TILT_SWITCH', PIN: args.PIN}
                }));


            client.on('message', (topic, message) => {

                message = new TextDecoder('utf-8').decode(message);

                switch (topic) {
                case `rpi/devices/sensors/tilt/${args.PIN}`:
                    self.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].tilted = String(message) === 'true';
                    break;
                }
            });
        }

        if (args.SENSORTYPE === SensorType.SWITCH) {
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] = {switched: false};
            this.clients[args.DEVICE_NAME].publish('rpi/subscription',
                JSON.stringify({
                    command: 'SUBSCRIBE',
                    args: {ALIAS: args.SENSOR_NAME, DEVICE: 'SWITCH', PIN: args.PIN}
                }));


            client.on('message', (topic, message) => {

                message = new TextDecoder('utf-8').decode(message);
                switch (topic) {
                case `rpi/devices/sensors/switch/${args.PIN}`:
                    self.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].switched = String(message) === 'true';
                    break;
                }
            });
        }

        if (args.SENSORTYPE === SensorType.PROXIMITY) {
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] = {proximal: false};
            this.clients[args.DEVICE_NAME]
                .publish('rpi/subscription', JSON
                    .stringify({
                        command: 'SUBSCRIBE',
                        args: {ALIAS: args.SENSOR_NAME, DEVICE: 'IR_PROXIMITY', PIN: args.PIN}
                    }));


            client.on('message', (topic, message) => {
                message = new TextDecoder('utf-8').decode(message);

                switch (topic) {
                case `rpi/devices/sensors/proximity/${args.PIN}`:
                    self.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].proximal = String(message) === 'true';
                    break;
                }
            });
        }


    }

    /**
     * Implement myReporter.
     * @param {object} args - the block's arguments.
     * @property {number} LETTER_NUM - the string value of the argument.
     * @property {string} TEXT - the string value of the argument.
     */
    helloAnalog (args) {
        const self = this;
        const client = this.clients[args.DEVICE_NAME];
        this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] = {channels: [0, 0, 0, 0]};
        this.clients[args.DEVICE_NAME].publish('rpi/subscription',
            JSON.stringify({
                command: 'SUBSCRIBE',
                args: {ALIAS: args.SENSOR_NAME, DEVICE: 'ANALOG', ADDR: args.ADDR}
            }));


        client.on('message', (topic, message) => {

            message = new TextDecoder('utf-8').decode(message);

            switch (topic) {
            case `rpi/devices/sensors/analog/${args.ADDR}`:
                self.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].channels = JSON.parse(String(message));
                break;
            }
        });


    }

    readAnalog (args) {
        const client = this.clients[args.DEVICE_NAME];
        const ego = this;
        client.publish('rpi/data',
            JSON.stringify({
                command: 'ANALOGREAD',
                args: {ALIAS: args.SENSOR_NAME}
            }));
        return new Promise(resolve => {
            client.on('message', (topic, message) => {

                message = new TextDecoder('utf-8').decode(message);
                const msg = JSON.parse(String(message));
                switch (topic) {
                case `rpi/devices/sensors/analog/${args.SENSOR_NAME}`:
                    ego.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].channels = msg;
                    resolve(msg[args.CHANNEL]);
                    break;
                }
            });
        });


    }


    hellofng (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/initialization', JSON.stringify({command: 'INIT_TB6612FNG', args: args}));

    }

    hellobipolar (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/initialization', JSON.stringify({command: 'INIT_DRV8825', args: args}));

    }

    hellofngsingle (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/initialization', JSON.stringify({command: 'INIT_SINGLE', args: args}));

    }

    hellouln (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/initialization', JSON.stringify({command: 'INIT_STEPPER', args: args}));

    }

    whenTilted (args) {
        return this.devices[args.DEVICE_NAME] && this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].tilted;
    }

    isTilted (args) {
        return this.devices[args.DEVICE_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].tilted;
    }

    whenSwitched (args) {
        return this.devices[args.DEVICE_NAME] && this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].switched === (args.STATE === 'off');
    }

    isSwitched (args) {
        return this.devices[args.DEVICE_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].switched;
    }

    isProximal (args) {
        return this.devices[args.DEVICE_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME] &&
            this.devices[args.DEVICE_NAME].state[args.SENSOR_NAME].proximal;
    }

    powerLED (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/led', JSON.stringify({command: 'LED', args: args}));

    }

    powerMotor (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/motor', JSON.stringify({command: 'MOTOR', args: args}));

    }
    powerBipolarMotor (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/bipolar', JSON.stringify({command: 'BIPOLAR_MOTOR', args: args}));

    }

    powerStepper (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/stepper', JSON.stringify({command: 'STEPPER', args: args}));

    }

    brakeMotor (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/motor', JSON.stringify({command: 'MOTOR.BRAKE', args: args}));

    }

    unbrakeMotor (args) {
        this.clients[args.DEVICE_NAME]
            .publish('rpi/devices/actuators/motor', JSON.stringify({command: 'MOTOR.UNBRAKE', args: args}));

    }


}

module.exports = Scratch3RpiBlocks;
