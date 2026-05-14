-- Run this on your MySQL server to support base64 file storage
ALTER TABLE edulink_learning.learning_materials MODIFY COLUMN file_uri LONGTEXT;
