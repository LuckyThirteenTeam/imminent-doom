import os

for year in range(1929, 2022 + 1):
    tarfile = str(year) + '.tar.gz'
    os.system('mkdir %d' % year)
    os.system('tar -xvzf tar_files/%s -C %d' % (tarfile, year))
