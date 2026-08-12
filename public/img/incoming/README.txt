DROP YOUR 6 IMAGES IN THIS FOLDER
=================================

Save each one here with exactly these names (extension can be .jpg, .jpeg,
.png or .webp — the script handles any of them):

  1   the technician cleaning the open indoor unit  ->  AC REPAIR
  2   the hand holding the remote at the wall unit  ->  INSTALLATION
  3   the man testing the unit with a multimeter    ->  MAINTENANCE
  4   the room with the blue airflow streams        ->  INDOOR AIR QUALITY
  5   the person in the suit cleaning the duct      ->  DUCT CLEANING
  6   the shop wall full of AC units                ->  SHOPPING

So the folder should end up looking like:

  incoming/1.jpg
  incoming/2.jpg
  incoming/3.jpg
  incoming/4.jpg
  incoming/5.jpg
  incoming/6.jpg

Then tell Claude "images are in" and they get copied into place:

  1 -> img/page-service-repair.jpg        + img/cube/face-1.jpg (hero)
  2 -> img/page-service-installation.jpg  + img/cube/face-2.jpg (hero)
  3 -> img/page-service-maintenance.jpg   + img/cube/face-3.jpg (hero)
  4 -> img/page-service-air-quality.jpg   + img/cube/face-4.jpg (hero)
  5 -> img/page-service-duct-cleaning.jpg + img/bg/bg-service-duct-cleaning.jpg
  6 -> img/page-shop.jpg                  + img/bg/bg-shop.jpg

The old images are kept in git, so if a new one looks worse we can put the
old one back on its own without touching the rest.
