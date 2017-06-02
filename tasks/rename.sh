# LANG=C
# LC_CTYPE=C
# git reset --hard
#taken from https://coderwall.com/p/guqrca/remove-all-node_module-folders-recursively
# find . -name "node_modules" -exec rm -rf '{}' +
cd packages
for d in $(ls .); do 
	npm publish
	# echo $d;
	# mv "$d" "$d-extra"
	# find . -type f -exec sed -i "" "s/$d/$d-extra/g" {} \;
done;
