cd /devcontainer/src/

export DEBFULLNAME="Ani Balasubramaniam"
export DEBEMAIL="ani@anionline.me"
export DEBFOLDER="/devcontainer/src"
export PACKAGE="devcontainer"
export PACKAGE_VERSION="0.1"
export DEB_PACKAGE_NAME="${PACKAGE}_${PACKAGE_VERSION}"

echo "Packaging ${DEB_PACKAGE_NAME}..."

# Call dh_make to generate debian/*
dh_make --packagename "${DEB_PACKAGE_NAME}" --copyright mit --indep --createorig --yes

# Remove make calls
grep -v makefile debian/rules > debian/rules.new 
mv debian/rules.new debian/rules

# Write install file
echo 'devcontainer usr/bin' > debian/install
echo 'templates etc/devcontainer' >> debian/install

# Write links file
echo 'etc/devcontainer/templates /usr/bin/templates' > debian/links

# Remove example files
rm debian/*.ex

debuild