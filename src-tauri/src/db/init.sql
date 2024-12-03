BEGIN TRANSACTION;
CREATE TABLE
    IF NOT EXISTS "games" (
                              "id" INTEGER NOT NULL,
                              "name" BLOB NOT NULL,
                              "library_id" TEXT NOT NULL,
                              "library_type" TEXT NOT NULL,
                              "install_status" INT NOT NULL,sTORE
                              "description" TEXT,
                              "play_time_secs" INTEGER NOT NULL,
                              "release_date" TIMESTAMP,
                              "last_played" TIMESTAMP,
                              PRIMARY KEY ("id" AUTOINCREMENT)
    );

CREATE TABLE
    IF NOT EXISTS "genres" (
                               "id" INTEGER NOT NULL,
                               "name" TEXT NOT NULL,
                               "metadata_source" TEXT NOT NULL,
                               "metadata_id" TEXT NOT NULL,
                               PRIMARY KEY ("id" AUTOINCREMENT)
    );

CREATE TABLE
    IF NOT EXISTS "game_genres" (
                                    "game_id" INTEGER NOT NULL,
                                    "genre_id" INTEGER NOT NULL,
                                    PRIMARY KEY ("game_id", "genre_id")
    );

CREATE UNIQUE INDEX IF NOT EXISTS "genres_metadata" ON "genres" ("metadata_source", "metadata_id");

CREATE UNIQUE INDEX IF NOT EXISTS "games_metadata" ON "games" ("library_type", "library_id");
COMMIT;