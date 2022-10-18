import os

for year in range(1929, 2022 + 1):
    tarfile = str(year) + '.tar.gz'
    url = 'https://www.ncei.noaa.gov/data/global-summary-of-the-day/archive/' + tarfile
    os.system('curl %s --output %s' % (url, tarfile))
