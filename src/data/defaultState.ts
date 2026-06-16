import type { Table, Door, Wall, Obstacle, TextBox } from '../types';

export const DEFAULT_ROOM_WIDTH = 33;
export const DEFAULT_ROOM_HEIGHT = 31;

export const DEFAULT_TABLES: Table[] = [
  {"id":"a7375cbf-a477-4f9e-aa61-936bc19a0316","type":"1x1","x":2,"y":1,"rotation":0,"label":"T1","width":2,"height":2},
  {"id":"faa8cc71-82eb-4e81-a244-9d453c90cfc3","type":"1x1","x":6,"y":1,"rotation":0,"label":"T2","width":2,"height":2},
  {"id":"9b140ad7-5d25-4b8d-a31a-7d5cfc74aa70","type":"1x1","x":2,"y":8,"rotation":0,"label":"T3","width":2,"height":2},
  {"id":"9f090aab-021f-4e82-bf77-1a25d1a301d2","type":"1x1","x":20,"y":12,"rotation":0,"label":"Servizio","width":2,"height":2},
  {"id":"627c3a88-a7cf-4f9e-8701-9510b165aa14","type":"circle2","x":26,"y":26,"rotation":0,"label":"Trullo","width":4,"height":4},
  {"id":"526c5832-71a2-40d9-9a1e-e465b06027ce","type":"1x1","x":2,"y":10,"rotation":0,"label":"T4","width":2,"height":2},
  {"id":"4d6dca3c-94f3-472e-9945-cc4d10a5282d","type":"1x1","x":2,"y":12,"rotation":0,"label":"T5","width":2,"height":2},
  {"id":"a3b37f83-2fb2-4f86-9738-86e26ba0d869","type":"1x1","x":2,"y":14,"rotation":0,"label":"T6","width":2,"height":2},
  {"id":"82e3f68d-0cb5-4e62-be3a-1e5c53e694e8","type":"1x1","x":2,"y":16,"rotation":0,"label":"T7","width":2,"height":2},
  {"id":"06c53af9-3323-4795-a624-09aed1fe55ef","type":"1x1","x":2,"y":18,"rotation":0,"label":"T8","width":2,"height":2},
  {"id":"31726893-95b4-474b-9f86-a42c45348886","type":"1x1","x":2,"y":20,"rotation":0,"label":"T9","width":2,"height":2},
  {"id":"e35d0e5e-bb09-4910-8069-ee427c905d86","type":"1x1","x":6,"y":8,"rotation":0,"label":"T10","width":2,"height":2},
  {"id":"0f296c9c-76c9-41b1-938f-af91a5049f65","type":"1x1","x":6,"y":10,"rotation":0,"label":"T11","width":2,"height":2},
  {"id":"8db24c70-7e96-429a-883e-52380cdbcbf9","type":"1x1","x":6,"y":12,"rotation":0,"label":"T12","width":2,"height":2},
  {"id":"4a2744ed-a7fa-4d23-866c-8564bb11daa5","type":"1x1","x":6,"y":14,"rotation":0,"label":"T13","width":2,"height":2},
  {"id":"e4f86399-c58f-4f9c-a0e0-38ff0e30ecb4","type":"1x1","x":6,"y":16,"rotation":0,"label":"T14","width":2,"height":2},
  {"id":"ae0dea3b-f036-4db4-af07-4b6144b60ca6","type":"1x1","x":6,"y":18,"rotation":0,"label":"T15","width":2,"height":2},
  {"id":"f10c62f6-df94-4c1b-9f31-520a5e161a16","type":"1x1","x":6,"y":20,"rotation":0,"label":"T16","width":2,"height":2},
  {"id":"250e5e93-81f6-4f84-a887-d53323a9e2d7","type":"1x1","x":12,"y":8,"rotation":0,"label":"T17","width":2,"height":2},
  {"id":"5e5b37e5-19b1-4b5d-aae6-0ab67529e681","type":"1x1","x":12,"y":10,"rotation":0,"label":"T18","width":2,"height":2},
  {"id":"8fd85603-07f2-4f15-83ba-46be935b737a","type":"1x1","x":12,"y":12,"rotation":0,"label":"T19","width":2,"height":2},
  {"id":"50313a37-784f-40dc-8b34-bb92f746ccb6","type":"1x1","x":12,"y":14,"rotation":0,"label":"T20","width":2,"height":2},
  {"id":"285e2fa6-ae83-4ec1-a0c0-4a48e4e68734","type":"1x1","x":12,"y":16,"rotation":0,"label":"T21","width":2,"height":2},
  {"id":"540d6f24-b85f-4b78-8b51-3c0d5844c9fb","type":"1x1","x":12,"y":18,"rotation":0,"label":"T22","width":2,"height":2},
  {"id":"d26eea98-0cc4-43d0-a730-4225a4f0cdde","type":"1x1","x":12,"y":20,"rotation":0,"label":"T23","width":2,"height":2},
  {"id":"609b14d7-ce2f-4ec7-9b80-9ccd91b95559","type":"1x1","x":28,"y":6,"rotation":0,"label":"T24","width":2,"height":2},
  {"id":"d22917d6-7417-4b1c-8cfe-fe2f8b96c607","type":"1x1","x":28,"y":8,"rotation":0,"label":"T25","width":2,"height":2},
  {"id":"923cf648-73a5-47a3-a46c-0b16407bd24a","type":"1x1","x":28,"y":10,"rotation":0,"label":"T26","width":2,"height":2},
  {"id":"6e2a8f68-81f5-48d8-8049-6978073f634b","type":"1x1","x":28,"y":12,"rotation":0,"label":"T27","width":2,"height":2},
  {"id":"6eb637b8-30e9-4496-a370-9dc382ca559a","type":"1x1","x":28,"y":14,"rotation":0,"label":"T28","width":2,"height":2},
  {"id":"001fa037-83ed-4ac6-b68c-7ad30945f3f4","type":"1x1","x":28,"y":16,"rotation":0,"label":"T29","width":2,"height":2},
  {"id":"efe1a878-a353-4953-9dd1-3e1df6b9da98","type":"1x1","x":28,"y":18,"rotation":0,"label":"T30","width":2,"height":2},
  {"id":"baa7924b-a0cc-4025-ba11-0c4f5b1ef369","type":"1x1","x":28,"y":20,"rotation":0,"label":"T31","width":2,"height":2},
  {"id":"ec61a33c-1cd9-46b6-9453-215b3f26205b","type":"1x1","x":26,"y":20,"rotation":0,"label":"T32","width":2,"height":2},
  {"id":"86c0b5f7-3f1b-4fd9-a4ec-0c13d0db73f8","type":"1x1","x":24,"y":20,"rotation":0,"label":"T33","width":2,"height":2},
  {"id":"1363da97-f0cc-4e15-bc2a-a3d4eddbeaee","type":"1x2","x":19,"y":6,"rotation":0,"label":"T34","width":4,"height":2},
];

export const DEFAULT_DOORS: Door[] = [
  {"id":"87705f5f-8ee3-40e2-91b9-c7f262eb0935","x":10,"y":4,"rotation":0,"width":2},
  {"id":"7800656f-33f1-4aab-9c0d-87467a89c304","x":20,"y":24,"rotation":0,"width":2},
  {"id":"f1a74470-b2c4-41fe-86fd-354c445b4369","x":17,"y":24,"rotation":0,"width":2},
  {"id":"1d9d230e-9f02-4067-a194-4802dd5c73fe","x":28,"y":4,"rotation":180,"width":2},
  {"id":"b02e7834-6b45-4c05-96e3-048f304b2806","x":16,"y":4,"rotation":180,"width":2},
  {"id":"5c3157f6-a412-4093-bbdd-4cec5f092f74","x":33,"y":1,"rotation":90,"width":2},
];

export const DEFAULT_WALLS: Wall[] = [
  {"id":"51bffbff-faf8-4385-9068-1ce39b8c541e","x":10,"y":6,"length":18,"rotation":90},
  {"id":"c83184ea-f559-4450-a435-852ec4feefd3","x":10,"y":0,"length":4,"rotation":90},
  {"id":"20e58aa3-bd05-411e-89e7-ae8a0ece5c80","x":0,"y":24,"length":17,"rotation":0},
  {"id":"9ac54497-c170-4246-8bea-db52f4133be7","x":11,"y":3,"length":3,"rotation":0},
  {"id":"9677b842-b629-41e3-8dcb-360ced19fcfc","x":16,"y":3,"length":10,"rotation":0},
  {"id":"efe19648-d236-4b69-9db1-81142357bd3a","x":19,"y":24,"length":7,"rotation":90},
  {"id":"aced517f-9aff-421a-928b-a1205151b630","x":22,"y":24,"length":5,"rotation":0},
  {"id":"39c51d03-67d9-4df5-835a-88dd6c24c838","x":32,"y":3,"length":21,"rotation":90},
  {"id":"71d2932a-8728-4e79-909b-2882074fe537","x":29,"y":24,"length":4,"rotation":0},
  {"id":"fcc91ea9-a804-413f-b392-a46f69da0623","x":23,"y":25,"length":6,"rotation":90},
  {"id":"4f7d14da-5f7f-4a33-a362-6ab3ab49a578","x":32,"y":25,"length":6,"rotation":90},
  {"id":"dd3cf525-aa12-46e1-a6d5-6e4c93bc880a","x":28,"y":3,"length":4,"rotation":0},
  {"id":"3d19e2f5-b677-4356-8400-c680e8b8a8a5","x":17,"y":0,"length":3,"rotation":90},
];

export const DEFAULT_OBSTACLES: Obstacle[] = [
  {"id":"63ccea85-f299-4995-a953-194889311185","x":20,"y":14,"label":"Colonna","width":2,"height":2},
];

export const DEFAULT_TEXTBOXES: TextBox[] = [
  {"id":"d4aced8e-8bee-4bd0-90a9-3b3636d18636","x":12,"y":0,"text":"Brace","width":4,"height":2,"fontSize":24},
  {"id":"b9971fab-7364-479f-92f0-909e1361c93b","x":9,"y":26,"text":"Cucina","width":4,"height":2,"fontSize":24},
  {"id":"ca3ce441-496f-40b1-bb3d-bdd0d26bffcd","x":20,"y":26,"text":"Bagno","width":3,"height":2,"fontSize":24},
];
